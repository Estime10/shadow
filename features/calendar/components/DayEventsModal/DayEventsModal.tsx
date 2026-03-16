"use client";

import { useCallback } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL } from "@/lib/config/animations";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatDateLabel } from "@/features/calendar/utils";
import { EventList } from "../EventList/EventList";
import { DayEventsModalOverlay } from "./DayEventsModalOverlay/DayEventsModalOverlay";
import { DayEventsModalPanel } from "./DayEventsModalPanel/DayEventsModalPanel";
import { DayEventsModalHeader } from "./DayEventsModalHeader/DayEventsModalHeader";

export type DayEventsModalProps = {
  open: boolean;
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onAddEvent: () => void;
  onEventClick: (event: CalendarEvent) => void;
};

export function DayEventsModal({
  open,
  date,
  events,
  onClose,
  onAddEvent,
  onEventClick,
}: DayEventsModalProps) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;
  useModalEffect({ open, onClose });
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).hasAttribute("data-backdrop")) onClose();
    },
    [onClose]
  );

  const title = date ? formatDateLabel(date) : "";

  return (
    <AnimatePresence>
      {open && date ? (
        <DayEventsModalOverlay duration={duration} onOverlayClick={handleOverlayClick}>
          <DayEventsModalPanel duration={duration}>
            <DayEventsModalHeader title={title} onAddEvent={onAddEvent} onClose={onClose} />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <EventList
                events={events}
                emptyMessage="Aucun événement ce jour. Cliquez sur « Ajouter » pour en créer un."
                onEventClick={onEventClick}
              />
            </div>
          </DayEventsModalPanel>
        </DayEventsModalOverlay>
      ) : null}
    </AnimatePresence>
  );
}
