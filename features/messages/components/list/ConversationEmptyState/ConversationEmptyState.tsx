"use client";

import type { ConversationEmptyStateProps } from "@/features/messages/types";
import { EMPTY_LAST_MESSAGE_TEXT } from "@/features/messages/constants/constants";
import { useConversationEmptyState } from "./useConversationEmptyState/useConversationEmptyState";
import { useCreateConversationModal } from "./useCreateConversationModal/useCreateConversationModal";
import { CreateConversationModal } from "./CreateConversationModal/CreateConversationModal";

export function ConversationEmptyState({
  profiles,
  currentUserId,
  modalOpen,
  setModalOpen,
  hidePanel = false,
}: ConversationEmptyStateProps) {
  const {
    searchQuery,
    setSearchQuery,
    creatingForProfileId,
    error,
    searchInputRef,
    filteredProfiles,
    handleSelectUser,
    handleCloseModal,
  } = useConversationEmptyState({ profiles, currentUserId, setModalOpen });

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
        onClose={handleCloseModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
        filteredProfiles={filteredProfiles}
        onSelectUser={handleSelectUser}
        creatingForProfileId={creatingForProfileId}
        error={error}
      />
    </>
  );
}
