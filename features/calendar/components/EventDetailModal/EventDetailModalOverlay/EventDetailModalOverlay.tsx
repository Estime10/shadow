"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";

type EventDetailModalOverlayProps = {
  duration: number;
  onOverlayClick: (e: React.MouseEvent) => void;
  children: ReactNode;
};

export function EventDetailModalOverlay({
  duration,
  onOverlayClick,
  children,
}: EventDetailModalOverlayProps) {
  return (
    <motion.div
      data-backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-modal-title"
      className="fixed inset-0 z-[10000] grid min-h-dvh place-items-center p-4"
      onClick={onOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: ANIMATION_EASING }}
    >
      <motion.div
        data-backdrop
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
