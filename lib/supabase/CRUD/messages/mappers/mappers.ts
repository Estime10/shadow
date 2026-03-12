import type { Message, MessageMediaType } from "@/types/message";
import type { MessageRow } from "../types/types";
import { ROOM_CONVERSATION_ID } from "../types/types";

function parseMediaType(mediaType: string | null): MessageMediaType | null {
  if (mediaType === "image" || mediaType === "video") return mediaType;
  return null;
}

/**
 * Mappe une ligne DB message vers le type Message du domaine.
 */
export function mapMessageRowToMessage(row: MessageRow): Message {
  const mediaType = parseMediaType(row.media_type ?? null);
  return {
    id: row.id,
    conversationId: row.conversation_id ?? ROOM_CONVERSATION_ID,
    senderId: row.user_id,
    text: row.text ?? "",
    createdAt: row.created_at,
    mediaUrl: row.media_url ?? null,
    mediaType: mediaType ?? null,
  };
}
