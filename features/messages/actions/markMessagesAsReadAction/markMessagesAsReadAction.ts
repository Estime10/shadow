"use server";

import { insertMessageReadBatch } from "@/lib/supabase/CRUD";
import { log } from "@/lib/logger/logger";

/**
 * Marque les messages comme lus pour l'utilisateur connecté (à l'ouverture du thread).
 */
export async function markMessagesAsReadAction(
  messageIds: string[]
): Promise<{ ok: boolean; error: string | null }> {
  if (messageIds.length === 0) return { ok: true, error: null };

  log("message-read", "markMessagesAsReadAction: appel", { count: messageIds.length });
  const result = await insertMessageReadBatch(messageIds);
  if (!result.ok) {
    log("message-read", "markMessagesAsReadAction: erreur", { error: result.error });
    return { ok: false, error: result.error };
  }
  log("message-read", "markMessagesAsReadAction: ok", {
    inserted: result.inserted,
    total: messageIds.length,
  });
  return { ok: true, error: null };
}
