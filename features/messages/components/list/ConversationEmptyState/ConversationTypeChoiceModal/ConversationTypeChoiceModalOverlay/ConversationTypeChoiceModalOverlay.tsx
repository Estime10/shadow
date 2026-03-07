"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";

type ConversationTypeChoiceModalOverlayProps = {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  onOverlayClick: (e: React.MouseEvent) => void;
  duration: number;
  children: ReactNode;
};

export function ConversationTypeChoiceModalOverlay({
  overlayRef,
  onOverlayClick,
  duration,
  children,
}: ConversationTypeChoiceModalOverlayProps) {
  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversation-type-choice-modal-title"
      className="fixed inset-0 z-[10000] grid min-h-dvh place-items-center p-4"
      onClick={onOverlayClick}
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
      {children}
    </motion.div>
  );
}
