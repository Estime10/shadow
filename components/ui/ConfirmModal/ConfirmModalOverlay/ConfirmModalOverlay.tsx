"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

type ConfirmModalOverlayProps = {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  onOverlayClick: (e: React.MouseEvent) => void;
  duration: number;
  easing: readonly [number, number, number, number];
  children: ReactNode;
};

export function ConfirmModalOverlay({
  overlayRef,
  onOverlayClick,
  duration,
  easing,
  children,
}: ConfirmModalOverlayProps) {
  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-[10000] grid min-h-dvh place-items-center p-4"
      onClick={onOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: easing }}
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
