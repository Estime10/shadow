import type { Profile } from "@/lib/supabase/CRUD";

/**
 * Filtre les profils par requête de recherche (username ou id).
 */
export function filterProfilesBySearch(profiles: Profile[], searchQuery: string): Profile[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return profiles;
  return profiles.filter(
    (p) => (p.username ?? "").toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
  );
}
