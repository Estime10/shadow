import { createClient } from "../../../server";
import { deleteConversation } from "../../conversations/deleteConversation/deleteConversation";

/**
 * Supprime un message (seul l'auteur peut). Si la conversation n'a plus aucun message, supprime aussi la conversation.
 */
export async function deleteMessage(
  messageId: string,
  conversationId?: string | null
): Promise<{ ok: boolean; error: string | null; conversationDeleted?: boolean }> {
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

  let conversationDeleted = false;
  if (conversationId) {
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", conversationId);
    if (count === 0) {
      const result = await deleteConversation(conversationId);
      conversationDeleted = result.ok;
    }
  }

  return { ok: true, error: null, conversationDeleted };
}
