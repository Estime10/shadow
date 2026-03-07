"use client";

import { useEffect, useRef } from "react";
import { useSWRConfig } from "swr";
import { createClient } from "@/lib/supabase/client";
import {
  mapRealtimeMessageToMessage,
  type RealtimeMessageRow,
} from "@/features/messages/lib/mapRealtimeMessageToMessage";
import type { MessageIdPageContent } from "@/features/messages/types";

const MESSAGES_LIST_KEY = "messages-list";

type RealtimeMessagePayload = {
  conversation_id: string | null;
  id: string;
  user_id: string;
  text: string | null;
  created_at: string;
  [key: string]: unknown;
};

type RealtimeMessageOldPayload = {
  id: string;
  conversation_id: string | null;
  [key: string]: unknown;
};

type RealtimeConversationPayload = {
  user_1_id: string;
  user_2_id: string;
  [key: string]: unknown;
};

/**
 * Signature .on("postgres_changes", filter, callback) utilisée pour DELETE.
 * Les types @supabase/supabase-js ne résolvent pas correctement cet overload.
 */
type ChannelWithPostgresChanges = {
  on(
    event: "postgres_changes",
    filter: { event: string; schema: string; table: string },
    callback: (payload: { new?: unknown; old?: unknown }) => void
  ): unknown;
};

/** Clé SWR du cache thread : ["thread", conversationId] ou ["thread", "room", withUserId]. */
export type ThreadCacheKey = readonly [string, string, string?] | null;

export type UseMessagesRealtimeOptions = {
  /** Quand on est sur la page thread, passer la clé pour mettre à jour le cache à partir du payload (sans refetch). */
  threadCacheKey?: ThreadCacheKey;
};

function isMessageForThread(
  conversationId: string | null,
  threadCacheKey: ThreadCacheKey
): boolean {
  if (!threadCacheKey || threadCacheKey.length < 2) return false;
  const isRoom = threadCacheKey[1] === "room";
  return isRoom ? conversationId == null : conversationId === threadCacheKey[1];
}

/**
 * S'abonne aux INSERT/DELETE/UPDATE sur conversations et messages.
 * Au lieu de router.refresh(), invalide ou met à jour le cache SWR :
 * - liste : mutate("messages-list") pour refetch liste.
 * - thread : si threadCacheKey fourni, met à jour le cache (ajout/suppression/édition) à partir du payload Realtime.
 */
export function useMessagesRealtime(
  conversationIds: string[],
  currentUserId?: string | null,
  options?: UseMessagesRealtimeOptions
) {
  const { mutate } = useSWRConfig();
  const idsKey = conversationIds.length > 0 ? conversationIds.slice().sort().join(",") : "";
  const hasConversationsSub = currentUserId != null && currentUserId !== "";
  const hasMessagesSub = idsKey.length > 0 || hasConversationsSub;
  const threadCacheKeyRef = useRef<ThreadCacheKey>(options?.threadCacheKey ?? null);
  const idsSetRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    threadCacheKeyRef.current = options?.threadCacheKey ?? null;
  }, [options?.threadCacheKey]);

  useEffect(() => {
    idsSetRef.current = idsKey.length > 0 ? new Set(idsKey.split(",")) : null;
  }, [idsKey]);

  useEffect(() => {
    if (!hasConversationsSub && !hasMessagesSub) return;

    const supabase = createClient();
    const channelName =
      typeof currentUserId === "string" && currentUserId.length > 0
        ? `messages-realtime-${currentUserId}`
        : idsKey.length > 0
          ? `messages-realtime-thread-${idsKey}`
          : "messages-realtime";

    const channelRef: { current: ReturnType<typeof supabase.channel> | null } = {
      current: null,
    };
    let cancelled = false;

    function revalidateList() {
      void mutate(MESSAGES_LIST_KEY);
    }

    function updateThreadCache(
      updater: (data: MessageIdPageContent | undefined) => MessageIdPageContent | undefined
    ) {
      const key = threadCacheKeyRef.current;
      if (!key) return;
      void mutate(key, updater, { revalidate: false });
    }

    function subscribeChannel() {
      if (cancelled) return;
      if (channelRef.current) return;
      const ch = supabase.channel(channelName);
      channelRef.current = ch;

      if (hasConversationsSub) {
        ch.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "conversations",
          },
          (payload: { new: RealtimeConversationPayload }) => {
            const row = payload.new;
            const isMine = row?.user_1_id === currentUserId || row?.user_2_id === currentUserId;
            if (isMine) revalidateList();
          }
        );
        ch.on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "conversations",
          },
          () => revalidateList()
        );
      }

      if (hasMessagesSub) {
        ch.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload: { new: RealtimeMessagePayload }) => {
            const row = payload.new;
            const conversationId = row?.conversation_id ?? null;
            const set = idsSetRef.current;
            if (set === null || (conversationId != null && set.has(conversationId))) {
              revalidateList();
            }
            const key = threadCacheKeyRef.current;
            if (key && isMessageForThread(conversationId, key)) {
              const msg = mapRealtimeMessageToMessage(row as RealtimeMessageRow);
              updateThreadCache((data) =>
                data ? { ...data, messages: [...data.messages, msg] } : undefined
              );
            }
          }
        );
        (ch as ChannelWithPostgresChanges).on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            revalidateList();
            const key = threadCacheKeyRef.current;
            const old = payload.old as RealtimeMessageOldPayload | undefined;
            if (!key || !old?.id) return;
            const convId = old.conversation_id ?? null;
            const deletedId = old.id;
            if (convId != null && isMessageForThread(convId, key)) {
              updateThreadCache((data) =>
                data
                  ? { ...data, messages: data.messages.filter((m) => m.id !== deletedId) }
                  : undefined
              );
            } else {
              // Sans conversation_id dans payload (REPLICA IDENTITY pas FULL), on refetch le thread
              // pour que l'autre onglet reçoive la liste à jour
              void mutate(key);
            }
          }
        );
        ch.on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
          },
          (payload: { new: RealtimeMessagePayload }) => {
            revalidateList();
            const key = threadCacheKeyRef.current;
            const row = payload.new;
            const conversationId = row?.conversation_id ?? null;
            if (!key || !isMessageForThread(conversationId, key)) return;
            const updated = mapRealtimeMessageToMessage(row as RealtimeMessageRow);
            updateThreadCache((data) =>
              data
                ? {
                    ...data,
                    messages: data.messages.map((m) => (m.id === updated.id ? updated : m)),
                  }
                : undefined
            );
          }
        );
      }

      ch.subscribe();
    }

    function trySubscribe() {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        if (!session?.access_token) return;
        supabase.realtime.setAuth(session.access_token);
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        subscribeChannel();
      });
    }

    trySubscribe();

    const retryDelays = [400, 1200];
    const retryTimeouts = retryDelays.map((delay) =>
      setTimeout(() => {
        if (cancelled) return;
        if (channelRef.current) return;
        trySubscribe();
      }, delay)
    );

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        subscribeChannel();
      }
    });

    return () => {
      cancelled = true;
      retryTimeouts.forEach(clearTimeout);
      authSub.unsubscribe();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentUserId, mutate, hasConversationsSub, hasMessagesSub, idsKey]);
}
