"use client";

import { AnimatePresence } from "framer-motion";
import type { Profile } from "@/lib/supabase/CRUD";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import { CreateConversationModalOverlay } from "./CreateConversationModalOverlay/CreateConversationModalOverlay";
import { CreateConversationModalPanel } from "./CreateConversationModalPanel/CreateConversationModalPanel";
import { CreateConversationModalHeader } from "./CreateConversationModalHeader/CreateConversationModalHeader";
import { CreateConversationModalBody } from "./CreateConversationModalBody/CreateConversationModalBody";

type CreateConversationModalProps = {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredProfiles: Profile[];
  onSelectUser: (profile: Profile) => void | Promise<void>;
  creatingForProfileId?: string | null;
  error?: string | null;
};

export function CreateConversationModal({
  open,
  onClose,
  searchQuery,
  onSearchChange,
  searchInputRef,
  filteredProfiles,
  onSelectUser,
  creatingForProfileId = null,
  error = null,
}: CreateConversationModalProps) {
  const { overlayRef, handleOverlayClick, duration } = useModalEffect({ open, onClose });
  return (
    <AnimatePresence>
      {open ? (
        <CreateConversationModalOverlay
          overlayRef={overlayRef}
          onOverlayClick={handleOverlayClick}
          duration={duration}
        >
          <CreateConversationModalPanel duration={duration}>
            <CreateConversationModalHeader onClose={onClose} />
            <CreateConversationModalBody
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              searchInputRef={searchInputRef}
              filteredProfiles={filteredProfiles}
              onSelectUser={onSelectUser}
              creatingForProfileId={creatingForProfileId}
              error={error}
            />
          </CreateConversationModalPanel>
        </CreateConversationModalOverlay>
      ) : null}
    </AnimatePresence>
  );
}
