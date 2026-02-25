import { createClient } from "../../../server";
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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, username")
    .eq("id", user.id)
    .maybeSingle();

  const fallbackUsername = emailToDisplayName(user.email ?? undefined);

  return {
    id: profile?.id ?? user.id,
    username: profile?.username?.trim() || fallbackUsername || null,
  };
}
