"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUpcomingEventsCountAction } from "@/features/calendar/actions/getUpcomingEventsCountAction/getUpcomingEventsCountAction";
import { useClientUserId } from "@/lib/hooks/messages/useClientUserId/useClientUserId";

const CHANNEL_NAME = "calendar-badge-events";

type CalendarBadgeContextValue = {
  upcomingCount: number;
};

const CalendarBadgeContext = createContext<CalendarBadgeContextValue | null>(null);

export function CalendarBadgeProvider({ children }: { children: ReactNode }) {
  const userId = useClientUserId();
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getUpcomingEventsCountAction().then(({ count }) => {
      if (!cancelled) setUpcomingCount(count);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channelRef: { current: ReturnType<typeof supabase.channel> | null } = { current: null };
    let cancelled = false;

    function refresh() {
      if (cancelled) return;
      getUpcomingEventsCountAction().then(({ count }) => {
        if (!cancelled) setUpcomingCount(count);
      });
    }

    function subscribe() {
      if (cancelled || channelRef.current) return;
      const ch = supabase.channel(CHANNEL_NAME);
      ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, refresh);
      ch.on("postgres_changes", { event: "UPDATE", schema: "public", table: "events" }, refresh);
      ch.on("postgres_changes", { event: "DELETE", schema: "public", table: "events" }, refresh);
      channelRef.current = ch;
      ch.subscribe();
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
        subscribe();
      }
    });

    const unsub = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        subscribe();
      }
    });

    return () => {
      cancelled = true;
      unsub.data.subscription.unsubscribe();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);

  const effectiveCount = userId ? upcomingCount : 0;
  const value = useMemo(() => ({ upcomingCount: effectiveCount }), [effectiveCount]);

  return <CalendarBadgeContext.Provider value={value}>{children}</CalendarBadgeContext.Provider>;
}

export function useCalendarBadgeCount(): number {
  const ctx = useContext(CalendarBadgeContext);
  return ctx?.upcomingCount ?? 0;
}
