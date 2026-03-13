import { createClient } from "../../../server";

export type CreateMessageMediaViewResult = { success: true } | { success: false; error: string };

/**
 * Enregistre que l'utilisateur courant a vu le média du message (insert dans message_media_views).
 * RLS : l'utilisateur doit être membre de la conversation.
 */
export async function createMessageMediaView(
  messageId: string
): Promise<CreateMessageMediaViewResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return { success: false, error: "Non authentifié" };

  const { error } = await supabase.from("message_media_views").insert({
    message_id: messageId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") return { success: true }; // déjà vu (unique constraint)
    return { success: false, error: error.message };
  }
  return { success: true };
}
