"use client";

import { type ReactNode } from "react";
import { CalendarBadgeProvider } from "@/lib/contexts/CalendarBadgeContext/CalendarBadgeContext";
import { NotificationsProvider } from "@/lib/contexts/NotificationsContext/NotificationsContext";

type NotificationsRootProps = {
  children: ReactNode;
};

/**
 * Enveloppe l'app avec les providers (badge nav Messages, badge nav Calendrier, sync cross-tab).
 */
export function NotificationsRoot({ children }: NotificationsRootProps) {
  return (
    <NotificationsProvider>
      <CalendarBadgeProvider>{children}</CalendarBadgeProvider>
    </NotificationsProvider>
  );
}
