import { createClient } from "../../../server";

/**
 * Retourne les user_id des membres du groupe (RLS : uniquement si l'appelant est membre).
 */
export async function getGroupMemberIds(groupId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (error) return [];
  return (data ?? []).map((row) => row.user_id).filter((id): id is string => id != null);
}
