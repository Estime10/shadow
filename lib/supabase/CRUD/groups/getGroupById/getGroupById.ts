import { createClient } from "../../../server";
import type { GroupRow } from "@/types";

export type { GroupRow } from "@/types";

/**
 * Récupère un groupe par id. Retourne null si pas trouvé ou pas membre (RLS).
 */
export async function getGroupById(groupId: string): Promise<GroupRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("id, name, created_by_user_id, created_at")
    .eq("id", groupId)
    .maybeSingle();

  if (error || !data) return null;
  return data as GroupRow;
}
