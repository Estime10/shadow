"use server";

import { getUnreadCountForCurrentUser } from "@/lib/supabase/CRUD";

export type GetNotificationsBadgeResult = { count: number };

/**
 * Nombre de messages non lus (conversations).
 * Utilisé par le provider pour le badge Messages et la synchro cross-tab.
 */
export async function getNotificationsBadgeAction(): Promise<GetNotificationsBadgeResult> {
  const count = await getUnreadCountForCurrentUser();
  return { count };
}
