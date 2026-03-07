"use client";

import type { Profile } from "@/lib/supabase/CRUD";
import { ProfileSelectListContent } from "@/features/messages/components/ProfileSelectListContent/ProfileSelectListContent";
import { getInitial } from "@/features/messages/utils";
import { FALLBACK_USERNAME } from "@/features/messages/constants";
import { useCreateGroupModal } from "@/lib/hooks/messages";
import { CreateGroupModalView } from "./CreateGroupModalView/CreateGroupModalView";

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  profiles: Profile[];
  currentUserId: string | null;
};

export function CreateGroupModal({
  open,
  onClose,
  profiles,
  currentUserId,
}: CreateGroupModalProps) {
  const {
    searchQuery,
    onSearchChange,
    searchInputRef,
    filteredProfiles,
    selectedIds,
    toggleSelection,
    selectedCountLabel,
    canSubmit,
    creating,
    error,
    handleCreateGroup,
  } = useCreateGroupModal({ open, profiles, currentUserId, onClose });

  return (
    <CreateGroupModalView
      open={open}
      onClose={onClose}
      canSubmit={canSubmit}
      creating={creating}
      error={error}
      onCreateGroup={handleCreateGroup}
    >
      <ProfileSelectListContent
        mode="group"
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchInputRef={searchInputRef}
        filteredProfiles={filteredProfiles}
        getInitial={getInitial}
        fallbackUsername={FALLBACK_USERNAME}
        selectedIds={selectedIds}
        onToggleSelection={toggleSelection}
        selectedCountLabel={selectedCountLabel}
      />
    </CreateGroupModalView>
  );
}
