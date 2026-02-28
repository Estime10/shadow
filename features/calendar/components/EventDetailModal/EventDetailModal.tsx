"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatEventDateTime } from "@/features/calendar/utils";

export type EventDetailModalProps = {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
};

export function EventDetailModal({ open, onClose, event }: EventDetailModalProps) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  function handleOverlayClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute("data-backdrop")) onClose();
  }

  if (!event) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          data-backdrop
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-detail-modal-title"
          className="fixed inset-0 z-[10000] grid min-h-dvh place-items-center p-4"
          onClick={handleOverlayClick}
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
          <motion.div
            className="relative z-10 w-full max-w-md flex flex-col rounded-xl border-2 border-(--border) bg-(--surface) shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: ANIMATION_EASING }}
          >
            <div className="shrink-0 flex items-center justify-between border-b-2 border-(--border) content-px py-3">
              <h2
                id="event-detail-modal-title"
                className="min-w-0 truncate pr-2 font-display text-lg font-bold uppercase tracking-wider text-(--text)"
              >
                {event.title}
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
            <div className="content-px py-4 space-y-4">
              <div>
                <span className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1">
                  Date et heure
                </span>
                <time dateTime={event.eventDate} className="font-display text-sm text-(--text)">
                  {formatEventDateTime(event.eventDate)}
                </time>
              </div>
              {event.description?.trim() ? (
                <div>
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1">
                    Description
                  </span>
                  <p className="font-display text-sm text-(--text) whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
