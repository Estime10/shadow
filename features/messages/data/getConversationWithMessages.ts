import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationById,
  getMessages,
  getProfiles,
} from "@/lib/supabase/CRUD";
import {
  buildLastMessageFromMessage,
  getOtherUserIdFromConvRow,
  getParticipantDisplayName,
} from "./helpers";

/**
 * Charge une conversation par id + messages + l'autre participant (nom).
 * Utilisé par la page thread /messages/[id].
 */
export async function getConversationWithMessages(conversationId: string): Promise<{
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
} | null> {
  const [profile, convRow] = await Promise.all([
    getCurrentUserProfile(),
    getConversationById(conversationId),
  ]);
  const currentUserId = profile?.id ?? null;

  if (!convRow) return null;

  const otherId = getOtherUserIdFromConvRow(convRow, currentUserId);
  const [profiles, messages] = await Promise.all([
    getProfiles([otherId]),
    getMessages(conversationId, 100),
  ]);
  const participantName = getParticipantDisplayName(profiles[0]?.username);
  const lastMessage = messages[messages.length - 1];

  const conversation: Conversation = {
    id: convRow.id,
    participant: {
      id: otherId,
      name: participantName,
      avatar: null,
    },
    lastMessage: buildLastMessageFromMessage(lastMessage, new Date().toISOString()),
    unreadCount: 0,
  };

  return { conversation, messages, currentUserId };
}
