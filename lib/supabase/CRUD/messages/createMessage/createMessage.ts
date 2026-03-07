import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import { mapMessageRowToMessage } from "../mappers/mappers";

const EPHEMERAL_HOURS = 24;

/**
 * Crée un message dans une conversation. user_id = utilisateur connecté, expires_at = now + 24h.
 */
export async function createMessage(
  conversationId: string,
  text: string
): Promise<{ message: ReturnType<typeof mapMessageRowToMessage> | null; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { message: null, error: auth.error };
  const { user } = auth;

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + EPHEMERAL_HOURS);

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      user_id: user.id,
      text: text.trim() || null,
      expires_at: expiresAt.toISOString(),
    })
    .select("id, user_id, conversation_id, text, media_url, media_type, created_at, expires_at")
    .single();

  if (error) return { message: null, error: error.message };
  return { message: mapMessageRowToMessage(data), error: null };
}
