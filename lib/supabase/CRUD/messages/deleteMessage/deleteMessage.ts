import { createClient } from "../../../server";

/**
 * Supprime un message. Seul l'auteur peut supprimer.
 */
export async function deleteMessage(
  messageId: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Non authentifié" };
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
