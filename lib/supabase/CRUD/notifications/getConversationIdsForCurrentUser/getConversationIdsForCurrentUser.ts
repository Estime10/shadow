import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

/**
 * Retourne les IDs de toutes les conversations de l'utilisateur connecté (direct + groupe).
 * Utilisé pour compter les messages non lus et construire la liste de notifications.
 */
export async function getConversationIdsForCurrentUser(): Promise<string[]> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return [];
  const { user } = auth;

  const [directRes, groupMembersRes] = await Promise.all([
    supabase
      .from("conversations")
      .select("id")
      .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`),
    supabase.from("group_members").select("group_id").eq("user_id", user.id),
  ]);

  const directIds = (directRes.data ?? []).map((row) => row.id);
  const groupIds = (groupMembersRes.data ?? [])
    .map((row) => row.group_id)
    .filter((id): id is string => id != null);

  if (groupIds.length === 0) return directIds;

  const groupConvsRes = await supabase
    .from("conversations")
    .select("id")
    .eq("type", "group")
    .in("group_id", groupIds);

  const groupConvIds = (groupConvsRes.data ?? []).map((row) => row.id);
  return [...new Set([...directIds, ...groupConvIds])];
}
