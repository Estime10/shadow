import { createClient } from "../../../server";

/**
 * Supprime un message (seul l'auteur peut).
 * La conversation reste en base : réouvrir avec le même user réutilise la même conversation et le realtime fonctionne.
 */
export async function deleteMessage(
  messageId: string,
  _conversationId?: string | null
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Non authentifié" };
  }

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
