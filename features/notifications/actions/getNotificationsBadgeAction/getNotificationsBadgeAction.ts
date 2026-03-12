"use server";

import { getUnreadCountForCurrentUser } from "@/lib/supabase/CRUD";

export type GetNotificationsBadgeResult = { count: number };

/**
 * Nombre de notifications non lues (messages non lus dans les conversations).
 * Utilisé par le provider pour le badge (hasUnread = count > 0) et la synchro cross-tab.
 */
export async function getNotificationsBadgeAction(): Promise<GetNotificationsBadgeResult> {
  const count = await getUnreadCountForCurrentUser();
  return { count };
}
