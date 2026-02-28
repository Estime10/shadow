"use client";

import { useState, useCallback, useRef } from "react";
import type { Profile } from "@/lib/supabase/CRUD";
import { findOrCreateConversationAction } from "@/features/messages/actions";
import { useFilteredOtherProfiles } from "@/lib/hooks/messages";

type UseConversationEmptyStateParams = {
  profiles: { id: string; username: string | null }[];
  currentUserId: string | null;
  setModalOpen: (open: boolean) => void;
};

export function useConversationEmptyState({
  profiles,
  currentUserId,
  setModalOpen,
}: UseConversationEmptyStateParams) {
  const [searchQuery, setSearchQuery] = useState("");
  const [creatingForProfileId, setCreatingForProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProfiles = useFilteredOtherProfiles(profiles, currentUserId, searchQuery);

  const handleSelectUser = useCallback(
    async (profile: Profile) => {
      if (creatingForProfileId) return;
      setError(null);
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
      if (err || !conversationId) {
        setError(err ?? "Impossible de créer la conversation");
        return;
      }
      setModalOpen(false);
      window.location.assign(`/messages/${conversationId}`);
    },
    [setModalOpen, creatingForProfileId]
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setError(null);
  }, [setModalOpen]);

  return {
    searchQuery,
    setSearchQuery,
    creatingForProfileId,
    error,
    searchInputRef,
    filteredProfiles,
    handleSelectUser,
    handleCloseModal,
  };
}
