import { createClient } from "../../../server";

/**
 * Pour un utilisateur donné, retourne les read_at par message_id.
 * Utilisé pour : filtre "message disparu après lecture" et indicateur "Lu" en UI.
 */
export async function getReadAtByMessageIds(
  messageIds: string[],
  userId: string
): Promise<Map<string, string>> {
  if (messageIds.length === 0) return new Map();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("message_reads")
    .select("message_id, read_at")
    .eq("user_id", userId)
    .in("message_id", messageIds);

  if (error) return new Map();

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    map.set(row.message_id, row.read_at);
  }
  return map;
}
