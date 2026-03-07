"use client";

import { type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import { CreateGroupModalViewOverlay } from "./CreateGroupModalViewOverlay/CreateGroupModalViewOverlay";
import { CreateGroupModalViewPanel } from "./CreateGroupModalViewPanel/CreateGroupModalViewPanel";

type CreateGroupModalViewProps = {
  open: boolean;
  onClose: () => void;
  canSubmit: boolean;
  creating?: boolean;
  error?: string | null;
  onCreateGroup: () => void;
  children: ReactNode;
};

export function CreateGroupModalView({
  open,
  onClose,
  canSubmit,
  creating = false,
  error = null,
  onCreateGroup,
  children,
}: CreateGroupModalViewProps) {
  const { overlayRef, handleOverlayClick, duration } = useModalEffect({
    open,
    onClose,
  });

  return (
    <AnimatePresence>
      {open ? (
        <CreateGroupModalViewOverlay
          overlayRef={overlayRef}
          onOverlayClick={handleOverlayClick}
          duration={duration}
        >
          <CreateGroupModalViewPanel
            duration={duration}
            onClose={onClose}
            canSubmit={canSubmit}
            creating={creating}
            error={error}
            onCreateGroup={onCreateGroup}
          >
            {children}
          </CreateGroupModalViewPanel>
        </CreateGroupModalViewOverlay>
      ) : null}
    </AnimatePresence>
  );
}
