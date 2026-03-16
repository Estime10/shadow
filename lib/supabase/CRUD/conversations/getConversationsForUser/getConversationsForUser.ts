import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import type { ConversationRow } from "../types/types";

/**
 * Liste les conversations où l'utilisateur connecté participe (direct + groupe).
 */
export async function getConversationsForUser(): Promise<ConversationRow[]> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return [];
  const { user } = auth;

  const [directRes, groupMembersRes] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, type, user_1_id, user_2_id, group_id, created_at")
      .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
      .order("created_at", { ascending: false }),
    supabase.from("group_members").select("group_id").eq("user_id", user.id),
  ]);

  const directRows = (directRes.data ?? []) as ConversationRow[];
  const groupIds = (groupMembersRes.data ?? [])
    .map((r) => r.group_id)
    .filter((id): id is string => id != null);

  if (groupIds.length === 0) return directRows;

  const { data: groupConvData } = await supabase
    .from("conversations")
    .select("id, type, user_1_id, user_2_id, group_id, created_at")
    .eq("type", "group")
    .in("group_id", groupIds)
    .order("created_at", { ascending: false });

  const groupRows = (groupConvData ?? []) as ConversationRow[];
  const merged = [...directRows, ...groupRows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return merged;
}
