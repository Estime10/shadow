import type { Conversation } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationsForUser,
  getLastMessagesForConversations,
  getProfiles,
  getReadAtByMessageIds,
} from "@/lib/supabase/CRUD";
import {
  buildLastMessageFromMessage,
  getOtherUserIdFromConvRow,
  getParticipantDisplayName,
} from "../helpers/helpers";

/**
 * Liste des conversations pour la sidebar (avec dernier message, nom de l'autre et unreadCount).
 * Unread = dernier message reçu de l'autre et pas encore lu par moi (message_reads).
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

  const lastMessageIdsFromOthers = convRows
    .map((row) => lastMessagesMap.get(row.id))
    .filter(
      (msg): msg is NonNullable<typeof msg> =>
        msg != null && currentUserId != null && msg.senderId !== currentUserId
    )
    .map((m) => m.id);
  const readAtMap =
    currentUserId && lastMessageIdsFromOthers.length > 0
      ? await getReadAtByMessageIds(lastMessageIdsFromOthers, currentUserId)
      : new Map<string, string>();

  const conversationsWithMessages = convRows.map((row) => {
    const otherId = getOtherUserIdFromConvRow(row, currentUserId);
    if (otherId == null) return null;
    const lastMessage = lastMessagesMap.get(row.id) ?? null;
    if (!lastMessage) return null;
    const name = getParticipantDisplayName(profileMap.get(otherId)?.username);
    const isFromOther = currentUserId != null && lastMessage.senderId !== currentUserId;
    const unreadCount = isFromOther && !readAtMap.has(lastMessage.id) ? 1 : 0;
    return {
      id: row.id,
      participant: { id: otherId, name, avatar: null as null },
      lastMessage: buildLastMessageFromMessage(lastMessage, row.created_at),
      unreadCount,
    };
  });

  const conversations = conversationsWithMessages.filter(
    (c): c is NonNullable<typeof c> => c !== null
  );

  return { conversations, currentUserId };
}
