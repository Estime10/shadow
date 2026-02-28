"use client";

import { useRef } from "react";
import { X, MessageCircle, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";

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
          aria-labelledby="conversation-type-choice-modal-title"
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
            className="relative z-10 flex w-full max-w-sm flex-col rounded-xl border-2 border-(--border) bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: ANIMATION_EASING }}
          >
            <div className="border-b-2 border-(--border) p-4">
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="conversation-type-choice-modal-title"
                  className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
                >
                  Nouvelle conversation
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
            <div className="flex flex-col gap-2 p-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectDirect();
                }}
                className="flex items-center gap-3 rounded-xl border-2 border-(--border) bg-(--bg) content-px py-4 text-left transition-colors hover:border-accent hover:bg-(--accent)/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--accent)/15 text-accent">
                  <MessageCircle className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-wider text-(--text)">
                    Message direct
                  </span>
                  <span className="block text-xs text-(--text-muted)">Conversation à deux</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectGroup();
                }}
                className="flex items-center gap-3 rounded-xl border-2 border-(--border) bg-(--bg) content-px py-4 text-left transition-colors hover:border-accent hover:bg-(--accent)/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--accent)/15 text-accent">
                  <Users className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <span className="block font-display text-sm font-bold uppercase tracking-wider text-(--text)">
                    Groupe chat
                  </span>
                  <span className="block text-xs text-(--text-muted)">
                    Conversation à plusieurs
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
