"use client";

import { useEffect } from "react";
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
 * RLS : les politiques SELECT doivent autoriser l'utilisateur à lire les lignes, sinon Realtime ne livre pas l'événement.
 */
export function useMessagesRealtime(conversationIds: string[], currentUserId?: string | null) {
  const router = useRouter();

  const idsKey = conversationIds.length > 0 ? conversationIds.slice().sort().join(",") : "";
  const hasConversationsSub = currentUserId != null && currentUserId !== "";
  const hasMessagesSub = idsKey.length > 0 || hasConversationsSub;

  useEffect(() => {
    if (!hasConversationsSub && !hasMessagesSub) return;

    const supabase = createClient();
    const idsSet = idsKey.length > 0 ? new Set(idsKey.split(",")) : null;

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

    const setup = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      }
      if (cancelled) return;

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
            if (idsSet === null || (conversationId != null && idsSet.has(conversationId))) {
              router.refresh();
            }
          }
        );
      }

      ch.subscribe();
    };

    setup();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [idsKey, currentUserId, router]);
}
