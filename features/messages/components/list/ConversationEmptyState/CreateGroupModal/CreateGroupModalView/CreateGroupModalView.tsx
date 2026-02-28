"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";
import { CreateGroupModalHeader } from "../CreateGroupModalHeader/CreateGroupModalHeader";
import { CreateGroupModalFooter } from "../CreateGroupModalFooter/CreateGroupModalFooter";

type CreateGroupModalViewProps = {
  open: boolean;
  onClose: () => void;
  canSubmit: boolean;
  creating?: boolean;
  error?: string | null;
  onCreateGroup: () => void;
  children: React.ReactNode;
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

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
            <CreateGroupModalHeader onClose={onClose} />
            <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
            {error ? (
              <p className="shrink-0 px-4 pb-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <CreateGroupModalFooter
              canSubmit={canSubmit}
              creating={creating}
              onSubmit={onCreateGroup}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
