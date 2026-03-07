import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

/**
 * Marque un message comme lu pour l'utilisateur connecté.
 * Idempotent : si déjà lu, la contrainte UNIQUE évite le doublon (upsert ou ignore).
 */
export async function insertMessageRead(
  messageId: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { ok: false, error: auth.error };
  const { user } = auth;

  const { error } = await supabase.from("message_reads").insert({
    message_id: messageId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") return { ok: true, error: null };
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
}
