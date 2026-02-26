"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/supabase/CRUD";
import type { ConversationEmptyStateProps } from "@/features/messages/types";
import { findOrCreateConversationAction } from "@/features/messages/actions";
import { useFilteredOtherProfiles } from "@/features/messages/hooks";
import { EMPTY_LAST_MESSAGE_TEXT } from "@/features/messages/constants";
import { useCreateConversationModal } from "./useCreateConversationModal/useCreateConversationModal";
import { CreateConversationModal } from "./CreateConversationModal/CreateConversationModal";

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

  const handleSelectUser = useCallback(
    async (profile: Profile) => {
      const { conversationId, error } = await findOrCreateConversationAction(profile.id);
      if (error || !conversationId) return;
      setModalOpen(false);
      router.replace(`/messages/${conversationId}`);
    },
    [router, setModalOpen]
  );

  const filteredProfiles = useFilteredOtherProfiles(profiles, currentUserId, searchQuery);

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
            {EMPTY_LAST_MESSAGE_TEXT}
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
