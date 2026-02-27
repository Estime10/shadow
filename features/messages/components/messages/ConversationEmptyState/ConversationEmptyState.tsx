"use client";

import { useState, useCallback, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [creatingForProfileId, setCreatingForProfileId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSelectUser = useCallback(
    async (profile: Profile) => {
      if (creatingForProfileId) return;
      setCreatingForProfileId(profile.id);
      let conversationId: string | null = null;
      let err: string | null = null;
      try {
        const result = await findOrCreateConversationAction(profile.id);
        conversationId = result.conversationId ?? null;
        err = result.error ?? null;
      } finally {
        setCreatingForProfileId(null);
      }
      if (err || !conversationId) return;
      setModalOpen(false);
      // router.replace() après une Server Action peut ne pas déclencher la navigation (Next.js).
      // window.location garantit la redirection vers la conversation créée.
      window.location.assign(`/messages/${conversationId}`);
    },
    [setModalOpen, creatingForProfileId]
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
        creatingForProfileId={creatingForProfileId}
      />
    </>
  );
}
