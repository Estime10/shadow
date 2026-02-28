import type { Message } from "@/types/message";
import type { ConversationRow } from "@/lib/supabase/CRUD";
import { FALLBACK_PARTICIPANT_NAME, EMPTY_LAST_MESSAGE_TEXT } from "../../constants/constants";

type LastMessageShape = {
  text: string;
  createdAt: string;
  senderId: string;
};

/**
 * Construit l'objet lastMessage pour une Conversation à partir d'un Message ou null.
 */
export function buildLastMessageFromMessage(
  message: Message | null | undefined,
  fallbackCreatedAt: string
): LastMessageShape {
  if (message) {
    return {
      text: message.text,
      createdAt: message.createdAt,
      senderId: message.senderId,
    };
  }
  return {
    text: EMPTY_LAST_MESSAGE_TEXT,
    createdAt: fallbackCreatedAt,
    senderId: "",
  };
}

/**
 * Déduit l'id de l'autre participant à partir d'une ligne conversation (user_1_id, user_2_id).
 */
export function getOtherUserIdFromConvRow(
  row: ConversationRow,
  currentUserId: string | null
): string {
  return row.user_1_id === currentUserId ? row.user_2_id : row.user_1_id;
}

/**
 * Nom d'affichage pour un participant à partir du username (profil) ou fallback.
 */
export function getParticipantDisplayName(username: string | null | undefined): string {
  return username?.trim() ?? FALLBACK_PARTICIPANT_NAME;
}
