import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationById,
  getMessages,
  getProfiles,
  getReadAtByMessageIds,
} from "@/lib/supabase/CRUD";
import {
  buildLastMessageFromMessage,
  getOtherUserIdFromConvRow,
  getParticipantDisplayName,
} from "../helpers/helpers";

/**
 * Charge une conversation par id + messages + l'autre participant (nom) + readMessageIds.
 * Utilisé par la page thread /messages/[id].
 */
export async function getConversationWithMessages(conversationId: string): Promise<{
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
  readMessageIds: string[];
} | null> {
  const [profile, convRow] = await Promise.all([
    getCurrentUserProfile(),
    getConversationById(conversationId),
  ]);
  const currentUserId = profile?.id ?? null;

  if (!convRow) return null;

  const otherId = getOtherUserIdFromConvRow(convRow, currentUserId);
  const disappearMinutes = profile?.messageDisappearAfterMinutes ?? 30;
  const [profiles, messages] = await Promise.all([
    getProfiles([otherId]),
    getMessages(
      convRow.id,
      100,
      "asc",
      currentUserId ? { currentUserId, disappearAfterMinutes: disappearMinutes } : undefined
    ),
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

  // "Lu" sur mes messages envoyés = l'autre participant a lu → on charge les lus par otherId
  const readMessageIds =
    otherId && messages.length > 0
      ? Array.from(
          (
            await getReadAtByMessageIds(
              messages.map((m) => m.id),
              otherId
            )
          ).keys()
        )
      : [];

  return { conversation, messages, currentUserId, readMessageIds };
}
