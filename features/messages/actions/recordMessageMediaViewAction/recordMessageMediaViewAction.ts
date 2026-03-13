"use server";

import { createMessageMediaView } from "@/lib/supabase/CRUD";

export type RecordMessageMediaViewResult = { success: boolean; error?: string };

/**
 * Enregistre que l'utilisateur courant a vu le média du message (insert message_media_views).
 * À appeler à l'ouverture de la modale de visualisation.
 */
export async function recordMessageMediaViewAction(
  messageId: string
): Promise<RecordMessageMediaViewResult> {
  const result = await createMessageMediaView(messageId);
  if (result.success) return { success: true };
  return { success: false, error: result.error };
}
