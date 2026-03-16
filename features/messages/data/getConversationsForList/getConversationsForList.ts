import type { Conversation } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationsForUser,
  getLastMessagesForConversations,
  getProfiles,
  getReadAtByMessageIds,
  getGroupsByIds,
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
  const groupIds = convRows
    .filter((row) => row.type === "group" && row.group_id != null)
    .map((row) => row.group_id as string);
  const [profiles, lastMessagesMap, groups] = await Promise.all([
    getProfiles(validOtherIds),
    getLastMessagesForConversations(conversationIds),
    getGroupsByIds(groupIds),
  ]);
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const groupMap = new Map(groups.map((g) => [g.id, g]));

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
    const lastMessage = lastMessagesMap.get(row.id) ?? null;
    const isFromOther =
      currentUserId != null && lastMessage != null && lastMessage.senderId !== currentUserId;
    const unreadCount =
      isFromOther && lastMessage != null && !readAtMap.has(lastMessage.id) ? 1 : 0;

    if (row.type === "group" && row.group_id != null) {
      const group = groupMap.get(row.group_id);
      const name = group?.name?.trim() ?? "Groupe";
      return {
        id: row.id,
        participant: { id: row.group_id, name, avatar: null as null },
        lastMessage: buildLastMessageFromMessage(lastMessage, row.created_at),
        unreadCount,
      };
    }

    const otherId = getOtherUserIdFromConvRow(row, currentUserId);
    if (otherId == null) return null;
    const name = getParticipantDisplayName(profileMap.get(otherId)?.username);
    return {
      id: row.id,
      participant: { id: otherId, name, avatar: null as null },
      lastMessage: buildLastMessageFromMessage(lastMessage, row.created_at),
      unreadCount,
    };
  });

  const conversations = conversationsWithMessages
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

  return { conversations, currentUserId };
}
