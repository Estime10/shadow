import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getMessages,
  getProfiles,
  ROOM_CONVERSATION_ID,
} from "@/lib/supabase/CRUD";
import { ROOM_DISPLAY_NAME } from "../../constants";
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
}> {
  const [profile, messages] = await Promise.all([getCurrentUserProfile(), getMessages(null)]);
  const currentUserId = profile?.id ?? null;
  const lastMessage = messages[messages.length - 1];

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

  return { conversation, messages, currentUserId };
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
