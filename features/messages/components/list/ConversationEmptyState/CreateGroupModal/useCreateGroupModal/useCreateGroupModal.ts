"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Profile } from "@/lib/supabase/CRUD";
import { useFilteredOtherProfiles } from "@/lib/hooks/messages";
import { createGroupConversationAction } from "@/features/messages/actions";

const MIN_PARTICIPANTS = 2;

export type UseCreateGroupModalParams = {
  open: boolean;
  profiles: Profile[];
  currentUserId: string | null;
  onClose: () => void;
};

export type UseCreateGroupModalReturn = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredProfiles: Profile[];
  selectedIds: Set<string>;
  toggleSelection: (profileId: string) => void;
  selectedCountLabel: string | null;
  canSubmit: boolean;
  creating: boolean;
  error: string | null;
  handleCreateGroup: () => void;
};

function buildSelectedCountLabel(count: number): string | null {
  if (count === 0) return null;
  return `${count} participant${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`;
}

export function useCreateGroupModal({
  open,
  profiles,
  currentUserId,
  onClose,
}: UseCreateGroupModalParams): UseCreateGroupModalReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProfiles = useFilteredOtherProfiles(profiles, currentUserId, searchQuery);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        setError(null);
        searchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const toggleSelection = useCallback((profileId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(profileId)) next.delete(profileId);
      else next.add(profileId);
      return next;
    });
  }, []);

  const handleCreateGroup = useCallback(async () => {
    if (selectedIds.size < MIN_PARTICIPANTS) return;
    setError(null);
    setCreating(true);
    const result = await createGroupConversationAction(Array.from(selectedIds));
    setCreating(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
    window.location.assign(`/messages/${result.conversationId}`);
  }, [selectedIds, onClose]);

  const selectedCountLabel = buildSelectedCountLabel(selectedIds.size);
  const canSubmit = selectedIds.size >= MIN_PARTICIPANTS && !creating;

  return {
    searchQuery,
    onSearchChange: setSearchQuery,
    searchInputRef,
    filteredProfiles,
    selectedIds,
    toggleSelection,
    selectedCountLabel,
    canSubmit,
    creating,
    error,
    handleCreateGroup,
  };
}
