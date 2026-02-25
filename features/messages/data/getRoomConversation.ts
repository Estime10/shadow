import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getMessages,
  getProfiles,
  ROOM_CONVERSATION_ID,
} from "@/lib/supabase/CRUD";
import { FALLBACK_PARTICIPANT_NAME } from "../constants";
import { buildLastMessageFromMessage, getParticipantDisplayName } from "./helpers";

/**
 * IDs des expéditeurs qui ne sont pas l'utilisateur connecté.
 */
function getOtherSenderIds(messages: Message[], currentUserId: string | null): string[] {
  if (!currentUserId) return [];
  const ids = new Set<string>();
  for (const m of messages) {
    if (m.senderId !== currentUserId) ids.add(m.senderId);
  }
  return [...ids];
}

/**
 * Construit la conversation "room" et les messages depuis Supabase.
 * Si withUserId est fourni (ex. depuis ?with= en ouvrant une conversation),
 * on affiche le username de cet user. Sinon on déduit l'autre participant des messages.
 */
export async function getRoomConversation(withUserId?: string | null): Promise<{
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
}> {
  const [profile, messages] = await Promise.all([getCurrentUserProfile(), getMessages(null)]);
  const currentUserId = profile?.id ?? null;

  const lastMessage = messages[messages.length - 1];
  const otherIds = getOtherSenderIds(messages, currentUserId);

  let participantId: string | null = null;
  let participantName = FALLBACK_PARTICIPANT_NAME;

  if (withUserId && withUserId !== currentUserId) {
    participantId = withUserId;
    const withProfiles = await getProfiles([withUserId]);
    participantName = getParticipantDisplayName(withProfiles[0]?.username);
  } else if (otherIds.length > 0) {
    const profiles = await getProfiles(otherIds);
    const lastMessageFromOther =
      lastMessage && currentUserId && lastMessage.senderId !== currentUserId;
    participantId = lastMessageFromOther ? lastMessage.senderId : otherIds[0];
    const participantProfile = profiles.find((p) => p.id === participantId) ?? null;
    participantName = getParticipantDisplayName(participantProfile?.username);
  }

  const conversation: Conversation = {
    id: ROOM_CONVERSATION_ID,
    participant: {
      id: participantId ?? ROOM_CONVERSATION_ID,
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
 * Si withUserId est fourni (ex. depuis /messages?with=), on affiche ce participant.
 * Si aucun message, on ne montre pas la conversation : à gauche rien, à droite "Aucun message".
 */
export async function getConversationsForList(withUserId?: string | null): Promise<{
  conversations: Conversation[];
  currentUserId: string | null;
}> {
  const { conversation, messages, currentUserId } = await getRoomConversation(withUserId);
  const conversations = messages.length === 0 ? [] : [conversation];
  return { conversations, currentUserId };
}
