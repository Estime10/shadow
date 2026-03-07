import type { Profile } from "@/lib/supabase/CRUD";

export type ProfileSelectListMode = "direct" | "group";

export type ProfileSelectListContentBase = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredProfiles: Profile[];
  getInitial: (username: string | null | undefined) => string;
  fallbackUsername: string;
};

export type ProfileSelectListContentDirect = ProfileSelectListContentBase & {
  mode: "direct";
  onSelectUser: (profile: Profile) => void | Promise<void>;
  creatingForProfileId?: string | null;
  error?: string | null;
};

export type ProfileSelectListContentGroup = ProfileSelectListContentBase & {
  mode: "group";
  selectedIds: Set<string>;
  onToggleSelection: (profileId: string) => void;
  selectedCountLabel?: React.ReactNode;
};

export type ProfileSelectListContentProps =
  | ProfileSelectListContentDirect
  | ProfileSelectListContentGroup;
