"use client";

import { AnimatePresence } from "framer-motion";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import { ConversationTypeChoiceModalOverlay } from "./ConversationTypeChoiceModalOverlay/ConversationTypeChoiceModalOverlay";
import { ConversationTypeChoiceModalPanel } from "./ConversationTypeChoiceModalPanel/ConversationTypeChoiceModalPanel";
import { ConversationTypeChoiceModalHeader } from "./ConversationTypeChoiceModalHeader/ConversationTypeChoiceModalHeader";
import { ConversationTypeChoiceOptions } from "./ConversationTypeChoiceOptions/ConversationTypeChoiceOptions";

export type ConversationTypeChoice = "direct" | "group";

type ConversationTypeChoiceModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectDirect: () => void;
  onSelectGroup: () => void;
};

export function ConversationTypeChoiceModal({
  open,
  onClose,
  onSelectDirect,
  onSelectGroup,
}: ConversationTypeChoiceModalProps) {
  const { overlayRef, handleOverlayClick, duration } = useModalEffect({
    open,
    onClose,
  });

  function handleDirect() {
    onClose();
    onSelectDirect();
  }

  function handleGroup() {
    onClose();
    onSelectGroup();
  }

  return (
    <AnimatePresence>
      {open ? (
        <ConversationTypeChoiceModalOverlay
          overlayRef={overlayRef}
          onOverlayClick={handleOverlayClick}
          duration={duration}
        >
          <ConversationTypeChoiceModalPanel duration={duration}>
            <ConversationTypeChoiceModalHeader onClose={onClose} />
            <ConversationTypeChoiceOptions
              onSelectDirect={handleDirect}
              onSelectGroup={handleGroup}
            />
          </ConversationTypeChoiceModalPanel>
        </ConversationTypeChoiceModalOverlay>
      ) : null}
    </AnimatePresence>
  );
}
