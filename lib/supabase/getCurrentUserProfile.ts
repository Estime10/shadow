import { createClient } from "./server";

export type CurrentUserProfile = {
  id: string;
  username: string | null;
};

/**
 * Dérive un libellé d'affichage à partir de l'email (partie avant @).
 */
function emailToDisplayName(email: string | undefined): string | null {
  if (!email) return null;
  const part = email.split("@")[0];
  return part && part.length > 0 ? part : null;
}

/**
 * Récupère le profil (public.users) de l'utilisateur connecté.
 * Si la ligne n'existe pas (ex. user créé avant le trigger) ou username est vide,
 * utilise l'email comme fallback pour afficher un libellé.
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
