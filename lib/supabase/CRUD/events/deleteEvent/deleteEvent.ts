import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

/**
 * Supprime un événement. RLS : seul le créateur peut supprimer.
 */
export async function deleteEvent(eventId: string): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { ok: false, error: auth.error };
  const { user } = auth;

  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("created_by", user.id)
    .select("id");

  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return {
      ok: false,
      error: "Événement introuvable ou non autorisé",
    };
  }
  return { ok: true, error: null };
}
