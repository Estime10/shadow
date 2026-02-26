import { createClient } from "../../../server";

/**
 * Supprime une conversation. Seul un participant peut supprimer.
 * Les messages sont supprimés en cascade (FK on delete cascade).
 */
export async function deleteConversation(
  conversationId: string
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
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .select("id");

  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return { ok: false, error: "Conversation introuvable ou non autorisée" };
  }
  return { ok: true, error: null };
}
