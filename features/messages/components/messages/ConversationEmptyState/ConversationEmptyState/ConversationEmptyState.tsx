"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/supabase/CRUD";
import type { ConversationEmptyStateProps } from "../../../types/props";
import { findOrCreateConversationAction } from "@/features/messages/actions";
import { getOtherProfiles } from "../getOtherProfiles/getOtherProfiles";
import { filterProfilesBySearch } from "../filterProfilesBySearch/filterProfilesBySearch";
import { useCreateConversationModal } from "../useCreateConversationModal/useCreateConversationModal";
import { CreateConversationModal } from "../CreateConversationModal/CreateConversationModal";

export function ConversationEmptyState({
  profiles,
  currentUserId,
  modalOpen,
  setModalOpen,
  hidePanel = false,
}: ConversationEmptyStateProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleSelectUser(profile: Profile) {
    const { conversationId, error } = await findOrCreateConversationAction(profile.id);
    if (error) return;
    setModalOpen(false);
    router.push(`/messages/${conversationId}`);
  }

  const otherProfiles = useMemo(
    () => getOtherProfiles(profiles, currentUserId),
    [profiles, currentUserId]
  );

  const filteredProfiles = useMemo(
    () => filterProfilesBySearch(otherProfiles, searchQuery),
    [otherProfiles, searchQuery]
  );

  useCreateConversationModal({
    modalOpen,
    setModalOpen,
    setSearchQuery,
    searchInputRef,
  });

  return (
    <>
      {!hidePanel ? (
        <div className="hidden flex-1 items-center justify-center bg-(--bg) lg:flex">
          <p className="font-display text-sm font-medium uppercase tracking-wider text-(--text-muted)">
            Aucun message
          </p>
        </div>
      ) : null}

      <CreateConversationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
        filteredProfiles={filteredProfiles}
        onSelectUser={handleSelectUser}
      />
    </>
  );
}
