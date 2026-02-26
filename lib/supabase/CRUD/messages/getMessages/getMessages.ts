import { createClient } from "../../../server";
import { mapMessageRowToMessage } from "../mappers/mappers";

/**
 * Récupère les messages d'une conversation (ou tous si conversationId non fourni, pour compat).
 * orderByCreatedAt: 'asc' = plus ancien en premier (thread), 'desc' = plus récent en premier (ex. dernier message pour la liste).
 */
export async function getMessages(
  conversationId: string | null,
  limit = 100,
  orderByCreatedAt: "asc" | "desc" = "asc"
) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from("messages")
    .select("id, user_id, conversation_id, text, media_url, media_type, created_at, expires_at")
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .order("created_at", { ascending: orderByCreatedAt === "asc" })
    .limit(limit);

  if (conversationId) {
    query = query.eq("conversation_id", conversationId);
  }

  const { data, error } = await query;

  if (error) return [];

  return (data ?? []).map(mapMessageRowToMessage);
}
