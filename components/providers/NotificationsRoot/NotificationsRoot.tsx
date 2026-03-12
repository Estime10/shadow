"use client";

import { type ReactNode } from "react";
import { NotificationsProvider } from "@/lib/contexts/NotificationsContext/NotificationsContext";

type NotificationsRootProps = {
  children: ReactNode;
};

/**
 * Enveloppe l'app avec le provider de notifications (badge nav, sync cross-tab).
 * Placé à la racine pour que le badge et les toasts de notification soient disponibles sur toutes les routes protégées.
 */
export function NotificationsRoot({ children }: NotificationsRootProps) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
