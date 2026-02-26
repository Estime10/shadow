"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type RealtimeMessagePayload = {
  conversation_id: string | null;
  [key: string]: unknown;
};

type RealtimeConversationPayload = {
  user_1_id: string;
  user_2_id: string;
  [key: string]: unknown;
};

/**
 * S'abonne aux INSERT sur conversations et messages.
 * - conversations : quand quelqu'un crée une conversation avec moi → refresh (liste à jour).
 * - messages : quand un nouveau message arrive dans une de mes conversations → refresh.
 * Sur la liste avec 0 conversations on écoute quand même les messages (RLS ne livre que ceux de mes conversations).
 * Quand currentUserId est fourni, on lit les conversationIds via une ref pour ne pas recréer le canal
 * quand la liste passe à 0 (après DELETE), afin que User B reste abonné et reçoive l'INSERT de la nouvelle conversation.
 */
export function useMessagesRealtime(conversationIds: string[], currentUserId?: string | null) {
  const router = useRouter();
  const idsKey = conversationIds.length > 0 ? conversationIds.slice().sort().join(",") : "";
  const hasConversationsSub = currentUserId != null && currentUserId !== "";
  const hasMessagesSub = idsKey.length > 0 || hasConversationsSub;

  const idsSetRef = useRef<Set<string> | null>(null);

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
            if (isMine) router.refresh();
          }
        );
        ch.on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "conversations",
          },
          () => router.refresh()
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
            const conversationId = payload.new?.conversation_id ?? null;
            const set = idsSetRef.current;
            if (set === null || (conversationId != null && set.has(conversationId))) {
              router.refresh();
            }
          }
        );
        ch.on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "messages",
          },
          () => router.refresh()
        );
        ch.on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
          },
          () => router.refresh()
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
  }, [currentUserId, router]);
}
