import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import { mapMessageRowToMessage } from "../mappers/mappers";

/**
 * Met à jour le texte d'un message. Seul l'auteur peut modifier.
 */
export async function updateMessage(
  messageId: string,
  text: string
): Promise<{ message: ReturnType<typeof mapMessageRowToMessage> | null; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { message: null, error: auth.error };
  const { user } = auth;

  const { data, error } = await supabase
    .from("messages")
    .update({ text: text.trim() || null })
    .eq("id", messageId)
    .eq("user_id", user.id)
    .select("id, user_id, conversation_id, text, media_url, media_type, created_at, expires_at")
    .maybeSingle();

  if (error) return { message: null, error: error.message };
  if (!data) {
    return {
      message: null,
      error: "Message introuvable ou non autorisé (vérifier la politique RLS UPDATE sur messages)",
    };
  }
  return { message: mapMessageRowToMessage(data), error: null };
}
