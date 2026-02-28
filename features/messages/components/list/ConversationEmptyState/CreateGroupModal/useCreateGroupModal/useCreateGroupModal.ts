"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Profile } from "@/lib/supabase/CRUD";
import { useFilteredOtherProfiles } from "@/lib/hooks/messages";

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProfiles = useFilteredOtherProfiles(profiles, currentUserId, searchQuery);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 0);
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

  const handleCreateGroup = useCallback(() => {
    if (selectedIds.size < MIN_PARTICIPANTS) return;
    // TODO: appeler l'action de création de groupe
    onClose();
  }, [selectedIds.size, onClose]);

  const selectedCountLabel = buildSelectedCountLabel(selectedIds.size);
  const canSubmit = selectedIds.size >= MIN_PARTICIPANTS;

  return {
    searchQuery,
    onSearchChange: setSearchQuery,
    searchInputRef,
    filteredProfiles,
    selectedIds,
    toggleSelection,
    selectedCountLabel,
    canSubmit,
    handleCreateGroup,
  };
}
