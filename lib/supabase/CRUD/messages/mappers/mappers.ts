import type { Message } from "@/types/message";
import type { MessageRow } from "../types/types";
import { ROOM_CONVERSATION_ID } from "../types/types";

/**
 * Mappe une ligne DB message vers le type Message du domaine.
 */
export function mapMessageRowToMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id ?? ROOM_CONVERSATION_ID,
    senderId: row.user_id,
    text: row.text ?? "",
    createdAt: row.created_at,
  };
}
