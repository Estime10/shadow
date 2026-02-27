import type { Message } from "@/types/message";

/** Valeur utilisée quand conversation_id est null (room). */
const FALLBACK_CONVERSATION_ID = "room";

/** Forme minimale du payload Realtime INSERT/UPDATE (messages). */
export type RealtimeMessageRow = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  text: string | null;
  created_at: string;
};

export function mapRealtimeMessageToMessage(row: RealtimeMessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id ?? FALLBACK_CONVERSATION_ID,
    senderId: row.user_id,
    text: row.text ?? "",
    createdAt: row.created_at,
  };
}
