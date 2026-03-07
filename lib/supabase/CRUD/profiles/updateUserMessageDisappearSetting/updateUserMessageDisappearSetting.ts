import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import type { MessageDisappearAfterMinutes } from "../types/types";

const ALLOWED_MINUTES: MessageDisappearAfterMinutes[] = [15, 30, 45, 60];

/**
 * Met à jour le réglage "disparition après lecture" de l'utilisateur connecté.
 * Utilisé par la dropdown des paramètres Messages (15 / 30 / 45 / 60 min).
 */
export async function updateUserMessageDisappearSetting(
  minutes: MessageDisappearAfterMinutes
): Promise<{ ok: boolean; error: string | null }> {
  if (!ALLOWED_MINUTES.includes(minutes)) {
    return { ok: false, error: "Valeur invalide (15, 30, 45 ou 60)" };
  }

  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { ok: false, error: auth.error };
  const { user } = auth;

  const { error } = await supabase
    .from("users")
    .update({ message_disappear_after_minutes: minutes })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, error: null };
}
