import { createClient } from "../../../server";
import { log } from "@/lib/logger/logger";

/**
 * Marque plusieurs messages comme lus pour l'utilisateur connecté.
 * Ignore les doublons (contrainte UNIQUE) par message.
 */
export async function insertMessageReadBatch(
  messageIds: string[]
): Promise<{ ok: boolean; error: string | null; inserted: number }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    log("message-read", "insertMessageReadBatch: non authentifié");
    return { ok: false, error: "Non authentifié", inserted: 0 };
  }

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
    log("message-read", "insertMessageReadBatch: erreur", {
      error: error.message,
      count: messageIds.length,
    });
    return { ok: false, error: error.message, inserted: 0 };
  }

  const inserted = data?.length ?? 0;
  log("message-read", "insertMessageReadBatch: ok", {
    userId: user.id,
    messageCount: messageIds.length,
    inserted,
  });
  return { ok: true, error: null, inserted };
}
