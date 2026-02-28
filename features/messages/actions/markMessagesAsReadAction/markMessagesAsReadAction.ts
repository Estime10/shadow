"use server";

import { getCurrentUserProfile, insertMessageReadBatch } from "@/lib/supabase/CRUD";
import { log } from "@/lib/logger/logger";

const DEFAULT_DISAPPEAR_MINUTES = 30;

/**
 * Marque les messages comme lus pour l'utilisateur connecté (à l'ouverture du thread).
 */
export async function markMessagesAsReadAction(
  messageIds: string[]
): Promise<{ ok: boolean; error: string | null }> {
  if (messageIds.length === 0) return { ok: true, error: null };

  const result = await insertMessageReadBatch(messageIds);
  if (!result.ok) return { ok: false, error: result.error };

  if (result.inserted > 0) {
    const readAt = new Date();
    const profile = await getCurrentUserProfile();
    const minutes = profile?.messageDisappearAfterMinutes ?? DEFAULT_DISAPPEAR_MINUTES;
    const expireAt = new Date(readAt.getTime() + minutes * 60 * 1000);
    const locale = "fr-FR";
    const opts: Intl.DateTimeFormatOptions = { dateStyle: "short", timeStyle: "medium" };
    log("message-read", `message lu à : ${readAt.toLocaleString(locale, opts)}`);
    log("message-read", `expire à : ${expireAt.toLocaleString(locale, opts)}`);
  }
  return { ok: true, error: null };
}
