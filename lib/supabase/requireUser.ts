import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const UNAUTHENTICATED_MESSAGE = "Non authentifié";

export type RequireUserSuccess = { user: User };
export type RequireUserError = { error: string };

/**
 * Récupère l'utilisateur connecté. À utiliser dans les CRUD côté serveur.
 * Évite la répétition du bloc getUser + if (!user) dans chaque fonction.
 */
export async function requireUser(
  supabase: SupabaseClient
): Promise<RequireUserSuccess | RequireUserError> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: UNAUTHENTICATED_MESSAGE };
  }

  return { user };
}
