import { createClient } from "../../../server";
import type { ConversationRow } from "../types/types";

/**
 * Récupère une conversation par id. Retourne null si pas trouvée ou pas participante.
 */
export async function getConversationById(conversationId: string): Promise<ConversationRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("conversations")
    .select("id, user_1_id, user_2_id, created_at")
    .eq("id", conversationId)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as ConversationRow;
  const isParticipant = row.user_1_id === user.id || row.user_2_id === user.id;
  return isParticipant ? row : null;
}
