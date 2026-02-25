import type { Conversation } from "@/types/message";
import {
  getCurrentUserProfile,
  getConversationsForUser,
  getMessages,
  getProfiles,
} from "@/lib/supabase/CRUD";

const FALLBACK_PARTICIPANT_NAME = "Ghost";

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

  const otherIds = convRows.map((row) =>
    row.user_1_id === currentUserId ? row.user_2_id : row.user_1_id
  );
  const profiles = await getProfiles(otherIds);
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const conversations: Conversation[] = await Promise.all(
    convRows.map(async (row) => {
      const otherId = row.user_1_id === currentUserId ? row.user_2_id : row.user_1_id;
      const messages = await getMessages(row.id, 1);
      const lastMessage = messages[messages.length - 1];
      const name = profileMap.get(otherId)?.username?.trim() ?? FALLBACK_PARTICIPANT_NAME;

      return {
        id: row.id,
        participant: { id: otherId, name, avatar: null },
        lastMessage: lastMessage
          ? {
              text: lastMessage.text,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.senderId,
            }
          : {
              text: "Aucun message",
              createdAt: row.created_at,
              senderId: "",
            },
        unreadCount: 0,
      };
    })
  );

  return { conversations, currentUserId };
}
