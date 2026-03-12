import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationById,
  getGroupById,
  getGroupMemberIds,
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
 * Charge une conversation par id + messages + participant (nom) + readMessageIds.
 * Utilisé par la page thread /messages/[id]. Gère direct (1:1) et group.
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

  const disappearMinutes = profile?.messageDisappearAfterMinutes ?? 30;

  if (convRow.type === "group" && convRow.group_id) {
    const [group, memberIds] = await Promise.all([
      getGroupById(convRow.group_id),
      getGroupMemberIds(convRow.group_id),
    ]);
    if (!group) return null;
    const otherUserIds =
      currentUserId != null ? memberIds.filter((id) => id !== currentUserId) : [];
    const messages = await getMessages(
      convRow.id,
      100,
      "asc",
      currentUserId
        ? {
            currentUserId,
            disappearAfterMinutes: disappearMinutes,
            otherUserIds: otherUserIds.length > 0 ? otherUserIds : undefined,
          }
        : undefined
    );
    const lastMessage = messages[messages.length - 1];
    const conversation: Conversation = {
      id: convRow.id,
      participant: {
        id: group.id,
        name: group.name,
        avatar: null,
      },
      lastMessage: buildLastMessageFromMessage(lastMessage, new Date().toISOString()),
      unreadCount: 0,
    };
    return { conversation, messages, currentUserId, readMessageIds: [] };
  }

  const otherId = getOtherUserIdFromConvRow(convRow, currentUserId);
  if (otherId == null) return null;
  const [profiles, messages] = await Promise.all([
    getProfiles([otherId]),
    getMessages(
      convRow.id,
      100,
      "asc",
      currentUserId
        ? {
            currentUserId,
            disappearAfterMinutes: disappearMinutes,
            otherUserIds: [otherId],
          }
        : undefined
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
