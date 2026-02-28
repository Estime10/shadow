import type { Conversation } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationsForUser,
  getLastMessagesForConversations,
  getProfiles,
} from "@/lib/supabase/CRUD";
import {
  buildLastMessageFromMessage,
  getOtherUserIdFromConvRow,
  getParticipantDisplayName,
} from "../helpers/helpers";

/**
 * Liste des conversations pour la sidebar (avec dernier message et nom de l'autre).
 * Une seule requête messages pour tous les derniers messages (évite N+1).
 */
export async function getConversationsForList(): Promise<{
  conversations: Conversation[];
  currentUserId: string | null;
}> {
  const [profile, convRows] = await Promise.all([
    getCurrentUserProfile(),
    getConversationsForUser(),
  ]);
  const currentUserId = profile?.id ?? null;

  if (convRows.length === 0) {
    return { conversations: [], currentUserId };
  }

  const conversationIds = convRows.map((row) => row.id);
  const otherIds = convRows.map((row) => getOtherUserIdFromConvRow(row, currentUserId));
  const validOtherIds = otherIds.filter((id): id is string => id != null);
  const [profiles, lastMessagesMap] = await Promise.all([
    getProfiles(validOtherIds),
    getLastMessagesForConversations(conversationIds),
  ]);
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const conversationsWithMessages = convRows.map((row) => {
    const otherId = getOtherUserIdFromConvRow(row, currentUserId);
    if (otherId == null) return null;
    const lastMessage = lastMessagesMap.get(row.id) ?? null;
    if (!lastMessage) return null;
    const name = getParticipantDisplayName(profileMap.get(otherId)?.username);
    return {
      id: row.id,
      participant: { id: otherId, name, avatar: null as null },
      lastMessage: buildLastMessageFromMessage(lastMessage, row.created_at),
      unreadCount: 0,
    };
  });

  const conversations = conversationsWithMessages.filter(
    (c): c is NonNullable<typeof c> => c !== null
  );

  return { conversations, currentUserId };
}
