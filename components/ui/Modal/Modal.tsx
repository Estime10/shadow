"use client";

import { type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import { ModalOverlay } from "./ModalOverlay/ModalOverlay";
import { ModalPanel } from "./ModalPanel/ModalPanel";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleId?: string;
  subtitle?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function Modal({
  open,
  onClose,
  title,
  titleId = "modal-title",
  subtitle,
  children,
  contentClassName = "",
}: ModalProps) {
  const { overlayRef, handleOverlayClick, duration } = useModalEffect({
    open,
    onClose,
  });

  return (
    <AnimatePresence>
      {open ? (
        <ModalOverlay
          overlayRef={overlayRef}
          onOverlayClick={handleOverlayClick}
          duration={duration}
          easing={ANIMATION_EASING}
          ariaLabelledby={title ? titleId : undefined}
        >
          <ModalPanel
            title={title}
            titleId={titleId}
            subtitle={subtitle}
            onClose={onClose}
            contentClassName={contentClassName}
            duration={duration}
            easing={ANIMATION_EASING}
          >
            {children}
          </ModalPanel>
        </ModalOverlay>
      ) : null}
    </AnimatePresence>
  );
}
