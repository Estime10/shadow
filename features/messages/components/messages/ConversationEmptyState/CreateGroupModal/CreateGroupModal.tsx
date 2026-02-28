"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";
import type { Profile } from "@/lib/supabase/CRUD";
import { useFilteredOtherProfiles } from "@/features/messages/hooks";
import { ProfileSelectListContent } from "@/features/messages/components/ProfileSelectListContent/ProfileSelectListContent";
import { getInitial } from "@/features/messages/utils";
import { FALLBACK_USERNAME } from "@/features/messages/constants";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  const filteredProfiles = useFilteredOtherProfiles(profiles, currentUserId, searchQuery);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function toggleSelection(profileId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(profileId)) next.delete(profileId);
      else next.add(profileId);
      return next;
    });
  }

  function handleCreateGroup() {
    if (selectedIds.size < 2) return;
    // TODO: appeler l'action de création de groupe
    onClose();
  }

  const selectedCountLabel =
    selectedIds.size > 0
      ? `${selectedIds.size} participant${selectedIds.size > 1 ? "s" : ""} sélectionné${selectedIds.size > 1 ? "s" : ""}`
      : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-group-modal-title"
          className="fixed inset-0 z-10000 grid min-h-dvh place-items-center p-4"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: ANIMATION_EASING }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
          <motion.div
            className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col rounded-xl border-2 border-(--border) bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: ANIMATION_EASING }}
          >
            <div className="shrink-0 border-b-2 border-(--border) p-4">
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="create-group-modal-title"
                  className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
                >
                  Créer un groupe
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <ProfileSelectListContent
                mode="group"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchInputRef={searchInputRef}
                filteredProfiles={filteredProfiles}
                getInitial={getInitial}
                fallbackUsername={FALLBACK_USERNAME}
                selectedIds={selectedIds}
                onToggleSelection={toggleSelection}
                selectedCountLabel={selectedCountLabel}
              />
            </div>
            <div className="shrink-0 border-t-2 border-(--border) p-4">
              <button
                type="button"
                onClick={handleCreateGroup}
                disabled={selectedIds.size < 2}
                title={selectedIds.size < 2 ? "Sélectionnez au moins 2 participants" : undefined}
                className="w-full rounded-xl border-2 border-accent bg-(--accent)/15 py-3 font-display text-sm font-bold uppercase tracking-wider text-accent transition-colors hover:bg-(--accent)/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:border-(--border) disabled:bg-(--bg) disabled:text-(--text-muted) disabled:opacity-60"
              >
                Créer le groupe
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
