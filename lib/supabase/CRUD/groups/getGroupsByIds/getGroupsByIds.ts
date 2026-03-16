import { createClient } from "../../../server";
import type { GroupRow } from "@/types";

/**
 * Récupère plusieurs groupes par leurs ids. Retourne uniquement ceux accessibles (RLS).
 */
export async function getGroupsByIds(groupIds: string[]): Promise<GroupRow[]> {
  if (groupIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("id, name, created_by_user_id, created_at")
    .in("id", groupIds);

  if (error) return [];
  return (data ?? []) as GroupRow[];
}
