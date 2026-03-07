import { createClient } from "../../../server";
import { getReadAtByMessageIds } from "../../messageReads/getReadAtByMessageIds/getReadAtByMessageIds";
import { mapMessageRowToMessage } from "../mappers/mappers";
import type { GetMessagesVisibilityOptions, Message } from "@/types";

export type { GetMessagesVisibilityOptions } from "@/types";

/**
 * Récupère les messages d'une conversation (ou tous si conversationId non fourni, pour compat).
 * orderByCreatedAt: 'asc' = plus ancien en premier (thread), 'desc' = plus récent en premier (ex. dernier message pour la liste).
 * Si options est fourni, les messages déjà lus par currentUserId et "expirés" (read_at + disappearAfterMinutes <= now) sont exclus.
 */
export async function getMessages(
  conversationId: string | null,
  limit = 100,
  orderByCreatedAt: "asc" | "desc" = "asc",
  options?: GetMessagesVisibilityOptions
): Promise<Message[]> {
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

  const messages = (data ?? []).map(mapMessageRowToMessage);

  if (!options || options.disappearAfterMinutes <= 0) return messages;

  const messageIds = messages.map((m) => m.id);
  const readAtMap = await getReadAtByMessageIds(messageIds, options.currentUserId);
  const nowMs = Date.now();
  const disappearMs = options.disappearAfterMinutes * 60 * 1000;

  const filtered = messages.filter((m) => {
    const readAt = readAtMap.get(m.id);
    if (!readAt) return true;
    return new Date(readAt).getTime() + disappearMs > nowMs;
  });

  return filtered;
}
