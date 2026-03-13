import type { Message } from "@/types/message";
import { parseMediaType } from "@/lib/supabase/CRUD/messages/parseMediaType/parseMediaType";
import { ROOM_CONVERSATION_ID } from "@/lib/supabase/constants";

/** Forme minimale du payload Realtime INSERT/UPDATE (messages). */
export type RealtimeMessageRow = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  text: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
};

export function mapRealtimeMessageToMessage(row: RealtimeMessageRow): Message {
  const mediaType = parseMediaType(row.media_type ?? null);
  return {
    id: row.id,
    conversationId: row.conversation_id ?? ROOM_CONVERSATION_ID,
    senderId: row.user_id,
    text: row.text ?? "",
    createdAt: row.created_at,
    mediaUrl: row.media_url ?? null,
    mediaType: mediaType ?? null,
    mediaViewedByMe: false,
  };
}
