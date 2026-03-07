"use client";

import { useMemo } from "react";
import { SearchInput } from "@/components/ui/SearchInput/SearchInput";
import { ProfileSelectListBody } from "./ProfileSelectListBody/ProfileSelectListBody";
import { profilesToItems } from "./profilesToItems";
import type { ProfileSelectListContentProps, ProfileSelectListMode } from "./types";

export type { ProfileSelectListContentProps, ProfileSelectListMode };

export function ProfileSelectListContent(props: ProfileSelectListContentProps) {
  const {
    searchQuery,
    onSearchChange,
    searchInputRef,
    filteredProfiles,
    getInitial,
    fallbackUsername,
  } = props;

  const items = useMemo(
    () => profilesToItems(filteredProfiles, getInitial, fallbackUsername),
    [filteredProfiles, getInitial, fallbackUsername]
  );
  const emptyMessage = searchQuery.trim() ? "Aucun utilisateur trouvé" : "Aucun utilisateur";

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col">
      <SearchInput
        ref={searchInputRef}
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Rechercher un utilisateur…"
        aria-label="Rechercher un utilisateur"
      />
      <ProfileSelectListBody
        {...props}
        items={items}
        emptyMessage={emptyMessage}
        filteredProfiles={filteredProfiles}
      />
    </div>
  );
}
