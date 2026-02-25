import type { Profile } from "@/lib/supabase/CRUD";

/**
 * Exclut le profil de l'utilisateur connecté de la liste.
 */
export function getOtherProfiles(profiles: Profile[], currentUserId: string | null): Profile[] {
  if (!currentUserId) return profiles;
  return profiles.filter((p) => p.id !== currentUserId);
}
