"use client";

import { AnimatePresence } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import { ConfirmModalOverlay } from "./ConfirmModalOverlay/ConfirmModalOverlay";
import { ConfirmModalPanel } from "./ConfirmModalPanel/ConfirmModalPanel";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
}: ConfirmModalProps) {
  const { overlayRef, handleOverlayClick, duration } = useModalEffect({
    open,
    onClose,
  });

  return (
    <AnimatePresence>
      {open ? (
        <ConfirmModalOverlay
          overlayRef={overlayRef}
          onOverlayClick={handleOverlayClick}
          duration={duration}
          easing={ANIMATION_EASING}
        >
          <ConfirmModalPanel
            title={title}
            message={message}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            onClose={onClose}
            onConfirm={onConfirm}
            duration={duration}
            easing={ANIMATION_EASING}
          />
        </ConfirmModalOverlay>
      ) : null}
    </AnimatePresence>
  );
}
