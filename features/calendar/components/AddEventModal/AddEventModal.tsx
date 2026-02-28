"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";
import type { CalendarEvent } from "@/features/calendar/types";
import { MONTH_LABELS } from "@/features/calendar/constants";

export type AddEventModalProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (event: CalendarEvent) => void;
};

function formatDateLabel(date: Date): string {
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export function AddEventModal({ open, onClose, selectedDate, onSubmit }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("12:00");
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const [hours, minutes] = time.split(":").map(Number);
    const eventDate = new Date(selectedDate);
    eventDate.setHours(hours, minutes, 0, 0);
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: t,
      description: description.trim() || null,
      eventDate: eventDate.toISOString(),
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
    };
    onSubmit(event);
    setTitle("");
    setDescription("");
    setTime("12:00");
    onClose();
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute("data-backdrop")) onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          data-backdrop
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-event-modal-title"
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
                id="add-event-modal-title"
                className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
              >
                Nouvel événement
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
            <p className="content-px pt-2 font-display text-sm text-(--text-muted)">
              {formatDateLabel(selectedDate)}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 content-px py-4">
              <div>
                <label
                  htmlFor="add-event-title"
                  className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
                >
                  Titre
                </label>
                <input
                  id="add-event-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex. Réunion équipe"
                  className="w-full rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="add-event-time"
                  className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
                >
                  Heure
                </label>
                <input
                  id="add-event-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="add-event-description"
                  className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
                >
                  Description <span className="text-(--text-muted) font-normal">(optionnel)</span>
                </label>
                <textarea
                  id="add-event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails…"
                  rows={3}
                  className="w-full resize-none rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border-2 border-(--border) py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--text) transition-colors hover:bg-(--surface-hover)"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-accent py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--bg) transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
