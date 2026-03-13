import { createClient } from "../../../server";

/**
 * Retourne les message_id pour lesquels l'utilisateur a déjà vu le média (présent dans message_media_views).
 */
export async function getMessageMediaViewedByUser(
  messageIds: string[],
  userId: string
): Promise<Set<string>> {
  if (messageIds.length === 0) return new Set();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("message_media_views")
    .select("message_id")
    .eq("user_id", userId)
    .in("message_id", messageIds);

  if (error) return new Set();
  return new Set((data ?? []).map((row) => row.message_id));
}
