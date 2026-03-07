import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

/**
 * Supprime un message (seul l'auteur peut).
 * La conversation reste en base : réouvrir avec le même user réutilise la même conversation et le realtime fonctionne.
 */
export async function deleteMessage(
  messageId: string,
  conversationId?: string | null
): Promise<{ ok: boolean; error: string | null }> {
  void conversationId; // réservé pour signature API / usage futur
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { ok: false, error: auth.error };
  const { user } = auth;

  const { data, error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("user_id", user.id)
    .select("id");

  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return {
      ok: false,
      error: "Message introuvable ou non autorisé (vérifier la politique RLS DELETE sur messages)",
    };
  }

  return { ok: true, error: null };
}
