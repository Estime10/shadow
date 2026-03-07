import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

/**
 * Marque plusieurs messages comme lus pour l'utilisateur connecté.
 * Ignore les doublons (contrainte UNIQUE) par message.
 */
export async function insertMessageReadBatch(
  messageIds: string[]
): Promise<{ ok: boolean; error: string | null; inserted: number }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { ok: false, error: auth.error, inserted: 0 };
  const { user } = auth;

  if (messageIds.length === 0) {
    return { ok: true, error: null, inserted: 0 };
  }

  const rows = messageIds.map((message_id) => ({
    message_id,
    user_id: user.id,
  }));

  const { data, error } = await supabase
    .from("message_reads")
    .upsert(rows, { onConflict: "message_id,user_id", ignoreDuplicates: true })
    .select("id");

  if (error) {
    return { ok: false, error: error.message, inserted: 0 };
  }

  const inserted = data?.length ?? 0;
  return { ok: true, error: null, inserted };
}
