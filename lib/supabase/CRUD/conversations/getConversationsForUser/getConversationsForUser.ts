import { createClient } from "../../../server";
import type { ConversationRow } from "../types/types";

/**
 * Liste les conversations où l'utilisateur connecté participe.
 */
export async function getConversationsForUser(): Promise<ConversationRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("id, user_1_id, user_2_id, created_at")
    .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ConversationRow[];
}
