"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL } from "@/lib/config/animations";
import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";
import { useEventDetailModal } from "@/features/calendar/hooks";
import type { CalendarEvent } from "@/features/calendar/types";
import { EventDetailModalShell } from "./EventDetailModalShell/EventDetailModalShell";

export type EventDetailModalProps = {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void;
};

export function EventDetailModal({
  open,
  onClose,
  event,
  onDeleteSuccess,
  onUpdateSuccess,
}: EventDetailModalProps) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;
  const state = useEventDetailModal({ event, onClose, onDeleteSuccess, onUpdateSuccess });
  if (!event) return null;

  const title = state.editing ? "Modifier l'événement" : event.title;
  function handleDeleteClick() {
    state.setMenuOpen(false);
    state.setConfirmDeleteOpen(true);
  }
  return (
    <>
      <AnimatePresence>
        {open ? (
          <EventDetailModalShell
            open={open}
            duration={duration}
            event={event}
            title={title}
            state={state}
            onDeleteClick={handleDeleteClick}
            onClose={onClose}
            onUpdateSuccess={onUpdateSuccess}
          />
        ) : null}
      </AnimatePresence>
      <ConfirmModal
        open={state.confirmDeleteOpen}
        onClose={() => state.setConfirmDeleteOpen(false)}
        onConfirm={state.handleConfirmDelete}
        title="Supprimer l'événement"
        message="Cet événement sera définitivement supprimé."
        confirmLabel="Supprimer"
      />
    </>
  );
}
