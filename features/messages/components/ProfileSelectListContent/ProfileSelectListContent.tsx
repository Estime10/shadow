"use client";

import { useMemo } from "react";
import type { Profile } from "@/lib/supabase/CRUD";
import { SearchInput } from "@/components/ui/SearchInput/SearchInput";
import {
  SelectableItemList,
  type SelectableItem,
} from "@/components/ui/SelectableItemList/SelectableItemList";

export type ProfileSelectListMode = "direct" | "group";

type ProfileSelectListContentBase = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredProfiles: Profile[];
  getInitial: (username: string | null | undefined) => string;
  fallbackUsername: string;
};

type ProfileSelectListContentDirect = ProfileSelectListContentBase & {
  mode: "direct";
  onSelectUser: (profile: Profile) => void | Promise<void>;
  creatingForProfileId?: string | null;
  error?: string | null;
};

type ProfileSelectListContentGroup = ProfileSelectListContentBase & {
  mode: "group";
  selectedIds: Set<string>;
  onToggleSelection: (profileId: string) => void;
  selectedCountLabel?: React.ReactNode;
};

export type ProfileSelectListContentProps =
  | ProfileSelectListContentDirect
  | ProfileSelectListContentGroup;

function profilesToItems(
  profiles: Profile[],
  getInitial: (username: string | null | undefined) => string,
  fallbackUsername: string
): SelectableItem[] {
  return profiles.map((p) => ({
    id: p.id,
    initial: getInitial(p.username),
    label: p.username ?? fallbackUsername,
  }));
}

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
      {props.mode === "direct" ? (
        <SelectableItemList
          variant="single"
          items={items}
          emptyMessage={emptyMessage}
          onSelect={(id) => {
            const profile = filteredProfiles.find((p) => p.id === id);
            if (profile) props.onSelectUser(profile);
          }}
          loadingId={props.creatingForProfileId ?? undefined}
          error={props.error ?? undefined}
        />
      ) : (
        <SelectableItemList
          variant="multi"
          items={items}
          emptyMessage={emptyMessage}
          selectedIds={props.selectedIds}
          onToggle={props.onToggleSelection}
          selectedCountLabel={props.selectedCountLabel}
        />
      )}
    </div>
  );
}
