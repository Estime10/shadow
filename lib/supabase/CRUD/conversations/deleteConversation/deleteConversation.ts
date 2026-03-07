import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

/**
 * Supprime une conversation. Seul un participant peut supprimer.
 * Les messages sont supprimés en cascade (FK on delete cascade).
 */
export async function deleteConversation(
  conversationId: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { ok: false, error: auth.error };

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
