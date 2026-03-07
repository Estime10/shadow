"use client";

import type { Profile } from "@/lib/supabase/CRUD";
import { ProfileSelectListContent } from "@/features/messages/components/ProfileSelectListContent/ProfileSelectListContent";
import { getInitial } from "@/features/messages/utils";
import { FALLBACK_USERNAME } from "@/features/messages/constants";

type CreateConversationModalBodyProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredProfiles: Profile[];
  onSelectUser: (profile: Profile) => void | Promise<void>;
  creatingForProfileId?: string | null;
  error?: string | null;
};

export function CreateConversationModalBody({
  searchQuery,
  onSearchChange,
  searchInputRef,
  filteredProfiles,
  onSelectUser,
  creatingForProfileId = null,
  error = null,
}: CreateConversationModalBodyProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <ProfileSelectListContent
        mode="direct"
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchInputRef={searchInputRef}
        filteredProfiles={filteredProfiles}
        getInitial={getInitial}
        fallbackUsername={FALLBACK_USERNAME}
        onSelectUser={onSelectUser}
        creatingForProfileId={creatingForProfileId}
        error={error}
      />
    </div>
  );
}
