"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getNotificationsBadgeAction } from "@/features/notifications/actions/getNotificationsBadgeAction/getNotificationsBadgeAction";
import { useClientUserId } from "@/lib/hooks/messages/useClientUserId/useClientUserId";

const NOTIFICATIONS_CHANNEL = "shadow-notifications";

type NotificationsMessage = {
  type: "count";
  count: number;
};

type NotificationsContextValue = {
  unreadCount: number;
  hasUnread: boolean;
  setUnreadCount: (count: number) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  try {
    return new BroadcastChannel(NOTIFICATIONS_CHANNEL);
  } catch {
    return null;
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const userId = useClientUserId();
  const [unreadCount, setUnreadCountState] = useState(0);

  const setUnreadCount = useCallback((count: number) => {
    const value = Math.max(0, Math.floor(count));
    setUnreadCountState(value);
    const ch = getChannel();
    if (ch) {
      ch.postMessage({ type: "count", count: value } satisfies NotificationsMessage);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getNotificationsBadgeAction().then(({ count }) => {
      if (!cancelled) setUnreadCountState(Math.max(0, count));
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    const ch = getChannel();
    if (!ch) return;
    const handler = (e: MessageEvent<NotificationsMessage>) => {
      if (e.data?.type === "count") {
        setUnreadCountState(Math.max(0, Math.floor(e.data.count)));
      }
    };
    ch.addEventListener("message", handler);
    return () => ch.removeEventListener("message", handler);
  }, []);

  const effectiveCount = userId ? unreadCount : 0;
  const hasUnread = effectiveCount > 0;
  const value = useMemo(
    () => ({ unreadCount: effectiveCount, hasUnread, setUnreadCount }),
    [effectiveCount, hasUnread, setUnreadCount]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

export function useNotificationsUnreadCount(): number {
  const ctx = useContext(NotificationsContext);
  return ctx?.unreadCount ?? 0;
}

export function useNotificationsHasUnread(): boolean {
  const ctx = useContext(NotificationsContext);
  return (ctx?.unreadCount ?? 0) > 0;
}
