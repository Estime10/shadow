"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** ID du titre pour aria-labelledby (requis si title fourni pour l’a11y). */
  titleId?: string;
  /** Sous-titre optionnel sous le header (ex. date formatée). */
  subtitle?: ReactNode;
  children: ReactNode;
  /** Classes additionnelles pour le panneau (contenu). */
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

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
          aria-labelledby={title ? titleId : undefined}
          className="fixed inset-0 z-[10000] grid min-h-dvh place-items-center p-4"
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
            className={`relative z-10 w-full max-w-md flex flex-col rounded-xl border-2 border-(--border) bg-(--surface) shadow-xl ${contentClassName}`.trim()}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: ANIMATION_EASING }}
          >
            {(title ?? subtitle) && (
              <div className="shrink-0 flex flex-col border-b-2 border-(--border) content-px py-3">
                <div className="flex items-center justify-between">
                  {title && (
                    <h2
                      id={titleId}
                      className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
                    >
                      {title}
                    </h2>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ml-auto"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                {subtitle && (
                  <p className="font-display text-sm text-(--text-muted) mt-1">{subtitle}</p>
                )}
              </div>
            )}
            <div className="flex flex-1 flex-col min-h-0">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
