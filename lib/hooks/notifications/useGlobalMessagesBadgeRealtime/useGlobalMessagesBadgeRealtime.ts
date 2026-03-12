"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getNotificationsBadgeAction } from "@/features/messages/actions/getNotificationsBadgeAction/getNotificationsBadgeAction";

const CHANNEL_NAME = "global-messages-badge";

/**
 * S'abonne aux changements sur les tables messages et message_reads pour mettre à jour
 * le badge "messages non lus" partout dans l'app (nouveau message → +, message lu → -).
 * Utilisé par NotificationsProvider pour que le badge nav reste cohérent en temps réel.
 */
export function useGlobalMessagesBadgeRealtime(
  userId: string | null | undefined,
  setUnreadCount: (count: number) => void
) {
  const setUnreadCountRef = useRef(setUnreadCount);
  useEffect(() => {
    setUnreadCountRef.current = setUnreadCount;
  }, [setUnreadCount]);

  useEffect(() => {
    if (!userId || userId === "") return;

    const supabase = createClient();
    const channelRef: { current: ReturnType<typeof supabase.channel> | null } = { current: null };
    let cancelled = false;

    function refreshBadge() {
      if (cancelled) return;
      getNotificationsBadgeAction()
        .then(({ count }) => {
          if (!cancelled) setUnreadCountRef.current(count);
        })
        .catch(() => {
          // ignore: garde le count actuel
        });
    }

    function subscribeChannel() {
      if (cancelled) return;
      if (channelRef.current) return;
      const ch = supabase.channel(CHANNEL_NAME);

      ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () =>
        refreshBadge()
      );
      ch.on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, () =>
        refreshBadge()
      );
      ch.on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, () =>
        refreshBadge()
      );

      ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "message_reads" }, () =>
        refreshBadge()
      );

      channelRef.current = ch;
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
  }, [userId]);
}
