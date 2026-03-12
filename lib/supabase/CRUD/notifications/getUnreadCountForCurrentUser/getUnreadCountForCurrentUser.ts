import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import { getReadAtByMessageIds } from "../../messageReads/getReadAtByMessageIds/getReadAtByMessageIds";
import { getConversationIdsForCurrentUser } from "../getConversationIdsForCurrentUser/getConversationIdsForCurrentUser";

/**
 * Nombre de messages non lus pour l'utilisateur connecté (messages reçus dans ses conversations, pas encore lus).
 * Utilisé pour le badge notifications (hasUnread = count > 0).
 */
export async function getUnreadCountForCurrentUser(): Promise<number> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return 0;
  const { user } = auth;

  const conversationIds = await getConversationIdsForCurrentUser();
  if (conversationIds.length === 0) return 0;

  const now = new Date().toISOString();
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, user_id")
    .in("conversation_id", conversationIds)
    .neq("user_id", user.id)
    .or(`expires_at.is.null,expires_at.gte.${now}`);

  if (error || !messages?.length) return 0;

  const messageIds = messages.map((m) => m.id);
  const readAtMap = await getReadAtByMessageIds(messageIds, user.id);
  const unreadCount = messageIds.filter((id) => !readAtMap.has(id)).length;
  return unreadCount;
}
