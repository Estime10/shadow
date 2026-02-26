import type { Conversation } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationsForUser,
  getMessages,
  getProfiles,
} from "@/lib/supabase/CRUD";
import {
  buildLastMessageFromMessage,
  getOtherUserIdFromConvRow,
  getParticipantDisplayName,
} from "../helpers/helpers";

/**
 * Liste des conversations pour la sidebar (avec dernier message et nom de l'autre).
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

  const otherIds = convRows.map((row) => getOtherUserIdFromConvRow(row, currentUserId));
  const profiles = await getProfiles(otherIds);
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const conversationsWithMessages = await Promise.all(
    convRows.map(async (row) => {
      const otherId = getOtherUserIdFromConvRow(row, currentUserId);
      const messages = await getMessages(row.id, 1);
      if (messages.length === 0) return null;
      const lastMessage = messages[messages.length - 1];
      const name = getParticipantDisplayName(profileMap.get(otherId)?.username);

      return {
        id: row.id,
        participant: { id: otherId, name, avatar: null },
        lastMessage: buildLastMessageFromMessage(lastMessage, row.created_at),
        unreadCount: 0,
      };
    })
  );

  const conversations = conversationsWithMessages.filter((c): c is Conversation => c !== null);

  return { conversations, currentUserId };
}
