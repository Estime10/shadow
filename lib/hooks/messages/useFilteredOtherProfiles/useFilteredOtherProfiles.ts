"use client";

import { useMemo } from "react";
import type { Profile } from "@/lib/supabase/CRUD";
import { getOtherProfiles, filterProfilesBySearch } from "@/features/messages/utils";

/**
 * Hook qui dérive la liste des profils "autres" (sans l'utilisateur courant) filtrée par recherche.
 * Centralise la logique pour éviter de la disperser dans le composant (SRP).
 */
export function useFilteredOtherProfiles(
  profiles: Profile[],
  currentUserId: string | null,
  searchQuery: string
): Profile[] {
  return useMemo(() => {
    const other = getOtherProfiles(profiles, currentUserId);
    return filterProfilesBySearch(other, searchQuery);
  }, [profiles, currentUserId, searchQuery]);
}
