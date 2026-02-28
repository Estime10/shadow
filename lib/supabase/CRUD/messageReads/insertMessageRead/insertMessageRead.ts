import { createClient } from "../../../server";
import { log } from "@/lib/logger/logger";

/**
 * Marque un message comme lu pour l'utilisateur connecté.
 * Idempotent : si déjà lu, la contrainte UNIQUE évite le doublon (upsert ou ignore).
 */
export async function insertMessageRead(
  messageId: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    log("message-read", "insertMessageRead: non authentifié");
    return { ok: false, error: "Non authentifié" };
  }

  const { error } = await supabase.from("message_reads").insert({
    message_id: messageId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      log("message-read", "insertMessageRead: déjà lu (ignoré)", { messageId });
      return { ok: true, error: null };
    }
    log("message-read", "insertMessageRead: erreur", { messageId, error: error.message });
    return { ok: false, error: error.message };
  }

  log("message-read", "insertMessageRead: ok", { messageId, userId: user.id });
  return { ok: true, error: null };
}
