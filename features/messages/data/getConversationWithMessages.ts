import type { Conversation, Message } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationById,
  getMessages,
  getProfiles,
} from "@/lib/supabase/CRUD";

const FALLBACK_PARTICIPANT_NAME = "Ghost";

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

  const otherId = convRow.user_1_id === currentUserId ? convRow.user_2_id : convRow.user_1_id;
  const [profiles, messages] = await Promise.all([
    getProfiles([otherId]),
    getMessages(conversationId, 100),
  ]);
  const otherProfile = profiles[0];
  const participantName = otherProfile?.username?.trim() ?? FALLBACK_PARTICIPANT_NAME;

  const lastMessage = messages[messages.length - 1];
  const conversation: Conversation = {
    id: convRow.id,
    participant: {
      id: otherId,
      name: participantName,
      avatar: null,
    },
    lastMessage: lastMessage
      ? {
          text: lastMessage.text,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        }
      : {
          text: "Aucun message",
          createdAt: new Date().toISOString(),
          senderId: "",
        },
    unreadCount: 0,
  };

  return { conversation, messages, currentUserId };
}
