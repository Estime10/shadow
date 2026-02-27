import { createClient } from "../../../server";
import { mapMessageRowToMessage } from "../mappers/mappers";
import type { Message } from "@/types/message";

/**
 * Récupère le dernier message (le plus récent) par conversation en une seule requête.
 * Évite le N+1 dans getConversationsForList.
 */
export async function getLastMessagesForConversations(
  conversationIds: string[]
): Promise<Map<string, Message>> {
  const map = new Map<string, Message>();
  if (conversationIds.length === 0) return map;

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("messages")
    .select("id, user_id, conversation_id, text, media_url, media_type, created_at, expires_at")
    .in("conversation_id", conversationIds)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .order("created_at", { ascending: false })
    .limit(Math.max(conversationIds.length * 2, 100));

  if (error) return map;

  for (const row of data ?? []) {
    const message = mapMessageRowToMessage(row);
    const cid = message.conversationId;
    if (!map.has(cid)) map.set(cid, message);
  }

  return map;
}
