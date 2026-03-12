import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getMessages,
  getProfiles,
  getReadAtByMessageIds,
  ROOM_CONVERSATION_ID,
} from "@/lib/supabase/CRUD";
import { ROOM_DISPLAY_NAME } from "@/features/messages/constants";
import { buildLastMessageFromMessage, getParticipantDisplayName } from "../helpers/helpers";

/**
 * Construit la conversation "room" et les messages depuis Supabase.
 * withUserId = id du user avec qui on ouvre la conversation (ex. depuis l’URL ?with=xxx).
 * Quand withUserId est fourni, on affiche le username de cet user ; sinon on affiche ROOM_DISPLAY_NAME.
 */
export async function getRoomConversation(withUserId?: string | null): Promise<{
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
  readMessageIds: string[];
}> {
  const profile = await getCurrentUserProfile();
  const currentUserId = profile?.id ?? null;
  const disappearMinutes = profile?.messageDisappearAfterMinutes ?? 30;
  const messages = await getMessages(
    null,
    100,
    "asc",
    currentUserId
      ? {
          currentUserId,
          disappearAfterMinutes: disappearMinutes,
          otherUserIds: withUserId ? [withUserId] : undefined,
        }
      : undefined
  );
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  let participantId: string = ROOM_CONVERSATION_ID;
  let participantName: string = ROOM_DISPLAY_NAME;

  if (withUserId && withUserId !== currentUserId) {
    participantId = withUserId;
    const withProfiles = await getProfiles([withUserId]);
    participantName = getParticipantDisplayName(withProfiles[0]?.username);
  }

  const conversation: Conversation = {
    id: ROOM_CONVERSATION_ID,
    participant: {
      id: participantId,
      name: participantName,
      avatar: null,
    },
    lastMessage: buildLastMessageFromMessage(lastMessage ?? null, new Date().toISOString()),
    unreadCount: 0,
  };

  // "Lu" sur mes messages envoyés = l'autre (withUserId en room) a lu
  const readByUserId = withUserId && withUserId !== currentUserId ? withUserId : null;
  const readMessageIds =
    readByUserId && messages.length > 0
      ? Array.from(
          (
            await getReadAtByMessageIds(
              messages.map((m) => m.id),
              readByUserId
            )
          ).keys()
        )
      : [];

  return { conversation, messages, currentUserId, readMessageIds };
}

/**
 * Liste des conversations pour la page messages (une seule = room).
 * withUserId = id du user avec qui on ouvre (ex. ?with= dans l’URL) → son username s’affiche.
 */
export async function getConversationsForList(withUserId?: string | null): Promise<{
  conversations: Conversation[];
  currentUserId: string | null;
}> {
  const { conversation, messages, currentUserId } = await getRoomConversation(withUserId);
  const conversations = messages.length === 0 ? [] : [conversation];
  return { conversations, currentUserId };
}
