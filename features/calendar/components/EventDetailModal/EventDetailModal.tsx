"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL, ANIMATION_EASING } from "@/lib/config/animations";
import { useClientUserId } from "@/lib/hooks/messages";
import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";
import { TimeInput } from "@/components/ui/TimeInput";
import { updateEventAction, deleteEventAction } from "@/features/calendar/actions";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatEventDateTime, formatEventTime, formatDateLabel } from "@/features/calendar/utils";

export type EventDetailModalProps = {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void;
};

function buildEventDateFromTime(eventDateISO: string, timeHHmm: string): string {
  const d = new Date(eventDateISO);
  const [h, m] = timeHHmm.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function EventDetailModal({
  open,
  onClose,
  event,
  onDeleteSuccess,
  onUpdateSuccess,
}: EventDetailModalProps) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;
  const currentUserId = useClientUserId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTime, setEditTime] = useState("12:00");
  const menuRef = useRef<HTMLDivElement>(null);

  const isCreator = event != null && currentUserId != null && event.createdBy === currentUserId;

  const openEditMode = useCallback(() => {
    if (!event) return;
    setEditTitle(event.title);
    setEditDescription(event.description ?? "");
    setEditTime(formatEventTime(event.eventDate));
    setEditing(true);
    setMenuOpen(false);
  }, [event]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  function handleOverlayClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute("data-backdrop")) onClose();
  }

  const handleConfirmDelete = useCallback(async () => {
    if (!event) return;
    const { ok } = await deleteEventAction(event.id);
    setConfirmDeleteOpen(false);
    if (ok) {
      onClose();
      onDeleteSuccess?.();
    }
  }, [event, onClose, onDeleteSuccess]);

  const handleSaveEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!event) return;
      const { error } = await updateEventAction(event.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        eventDate: buildEventDateFromTime(event.eventDate, editTime),
      });
      if (!error) {
        setEditing(false);
        setMenuOpen(false);
        onUpdateSuccess?.();
      }
    },
    [event, editTitle, editDescription, editTime, onUpdateSuccess]
  );

  const handleCancelEdit = useCallback(() => {
    setEditing(false);
    if (event) {
      setEditTitle(event.title);
      setEditDescription(event.description ?? "");
      setEditTime(formatEventTime(event.eventDate));
    }
  }, [event]);

  if (!event) return null;

  return (
    <>
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
                  {editing ? "Modifier l'événement" : event.title}
                </h2>
                <div className="flex items-center gap-1">
                  {isCreator && !editing && (
                    <div className="relative" ref={menuRef}>
                      <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label="Options"
                        aria-expanded={menuOpen}
                      >
                        <MoreHorizontal className="h-5 w-5" aria-hidden />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border-2 border-(--border) bg-(--surface) py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={openEditMode}
                            className="flex w-full items-center gap-2 content-px py-2 text-left font-display text-sm text-(--text) hover:bg-(--bg)"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              setConfirmDeleteOpen(true);
                            }}
                            className="flex w-full items-center gap-2 content-px py-2 text-left font-display text-sm text-(--error) hover:bg-(--bg)"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
              <div className="content-px py-4 space-y-4">
                {editing ? (
                  <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
                    <p className="font-display text-sm text-(--text-muted)">
                      {formatDateLabel(new Date(event.eventDate))}
                    </p>
                    <div>
                      <label
                        htmlFor="edit-event-title"
                        className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
                      >
                        Titre
                      </label>
                      <input
                        id="edit-event-title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) focus:border-accent focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-event-time"
                        className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
                      >
                        Heure
                      </label>
                      <TimeInput
                        id="edit-event-time"
                        value={editTime}
                        onChange={setEditTime}
                        stepMinutes={15}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-event-description"
                        className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1"
                      >
                        Description <span className="font-normal">(optionnel)</span>
                      </label>
                      <textarea
                        id="edit-event-description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2.5 font-display text-sm text-(--text) focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 rounded-lg border-2 border-(--border) py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--text) transition-colors hover:bg-(--surface-hover)"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-accent py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--bg) transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <span className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1">
                        Date et heure
                      </span>
                      <time
                        dateTime={event.eventDate}
                        className="font-display text-sm text-(--text)"
                      >
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
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'événement"
        message="Cet événement sera définitivement supprimé."
        confirmLabel="Supprimer"
      />
    </>
  );
}
