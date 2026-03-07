import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import type { CurrentUserProfile } from "../types/types";

function emailToDisplayName(email: string | undefined): string | null {
  if (!email) return null;
  const part = email.split("@")[0];
  return part && part.length > 0 ? part : null;
}

/**
 * Récupère le profil (public.users) de l'utilisateur connecté.
 * Fallback sur l'email si pas de ligne ou username vide.
 */
export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return null;
  const { user } = auth;

  const { data: profile } = await supabase
    .from("users")
    .select("id, username, message_disappear_after_minutes")
    .eq("id", user.id)
    .maybeSingle();

  const fallbackUsername = emailToDisplayName(user.email ?? undefined);
  const disappearMinutes = profile?.message_disappear_after_minutes ?? 30;
  const validMinutes = [15, 30, 45, 60].includes(disappearMinutes) ? disappearMinutes : 30;

  return {
    id: profile?.id ?? user.id,
    username: profile?.username?.trim() || fallbackUsername || null,
    messageDisappearAfterMinutes: validMinutes,
  };
}
