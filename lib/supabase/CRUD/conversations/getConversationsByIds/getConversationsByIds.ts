import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import type { ConversationRow } from "../types/types";

/**
 * Récupère les conversations par liste d'IDs (direct + groupe). RLS filtre par participant.
 */
export async function getConversationsByIds(ids: string[]): Promise<ConversationRow[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("id, type, user_1_id, user_2_id, group_id, created_at")
    .in("id", ids);

  if (error) return [];
  return (data ?? []) as ConversationRow[];
}
