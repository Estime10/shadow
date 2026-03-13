import { createClient } from "../../../server";
import { getMessageMediaViewedByUser } from "../../message_media_views/getMessageMediaViewedByUser/getMessageMediaViewedByUser";
import { getReadAtByMessageIds } from "../../messageReads/getReadAtByMessageIds/getReadAtByMessageIds";
import { mapMessageRowToMessage } from "../mappers/mappers";
import type { GetMessagesVisibilityOptions, Message } from "@/types";

export type { GetMessagesVisibilityOptions } from "@/types";

/** Délai minimum (24h) après création pour que mes messages puissent disparaître une fois lus par l'autre. */
const MIN_TIME_FOR_SENT_DISAPPEAR_MS = 24 * 60 * 60 * 1000;

/**
 * Récupère les messages d'une conversation (ou tous si conversationId non fourni, pour compat).
 * orderByCreatedAt: 'asc' = plus ancien en premier (thread), 'desc' = plus récent en premier (ex. dernier message pour la liste).
 * Si options est fourni :
 * - Messages reçus : exclus si currentUserId les a lus et read_at + disappearAfterMinutes <= now.
 * - Mes messages : exclus si otherUserIds est fourni, qu'au moins un autre les a lus (read_at + disappearAfterMinutes <= now), et created_at + 24h <= now.
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

  let messages: Message[] = (data ?? []).map(mapMessageRowToMessage);

  if (options?.currentUserId) {
    const withMediaIds = messages
      .filter((m) => m.mediaUrl != null && m.mediaUrl !== "")
      .map((m) => m.id);
    const viewedSet =
      withMediaIds.length > 0
        ? await getMessageMediaViewedByUser(withMediaIds, options.currentUserId)
        : new Set<string>();
    messages = messages.map((m) => ({
      ...m,
      mediaViewedByMe: viewedSet.has(m.id),
    }));
  }

  if (!options || options.disappearAfterMinutes <= 0) return messages;

  const messageIds = messages.map((m) => m.id);
  const readAtMap = await getReadAtByMessageIds(messageIds, options.currentUserId);
  const nowMs = Date.now();
  const disappearMs = options.disappearAfterMinutes * 60 * 1000;

  const otherIds = options.otherUserIds?.filter((id) => id !== options.currentUserId) ?? [];
  const readAtMapsByOther: Map<string, string>[] = [];
  if (otherIds.length > 0) {
    const myMessageIds = messages
      .filter((m) => m.senderId === options.currentUserId)
      .map((m) => m.id);
    if (myMessageIds.length > 0) {
      for (const otherId of otherIds) {
        const map = await getReadAtByMessageIds(myMessageIds, otherId);
        readAtMapsByOther.push(map);
      }
    }
  }

  const filtered = messages.filter((m) => {
    const isMine = m.senderId === options.currentUserId;

    if (isMine && readAtMapsByOther.length > 0) {
      const createdMs = new Date(m.createdAt).getTime();
      if (nowMs - createdMs < MIN_TIME_FOR_SENT_DISAPPEAR_MS) return true;
      const readAtBySomeone = readAtMapsByOther.some((map) => {
        const readAt = map.get(m.id);
        return readAt != null && new Date(readAt).getTime() + disappearMs <= nowMs;
      });
      if (readAtBySomeone) return false;
      return true;
    }

    const readAt = readAtMap.get(m.id);
    if (!readAt) return true;
    return new Date(readAt).getTime() + disappearMs > nowMs;
  });

  return filtered;
}
