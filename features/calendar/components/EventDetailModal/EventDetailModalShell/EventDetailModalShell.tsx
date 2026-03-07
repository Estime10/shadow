"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import type { UseEventDetailModalReturn } from "@/features/calendar/hooks";
import { EventDetailModalOverlay } from "../EventDetailModalOverlay/EventDetailModalOverlay";
import { EventDetailModalPanel } from "../EventDetailModalPanel/EventDetailModalPanel";
import { EventDetailModalHeader } from "../EventDetailModalHeader/EventDetailModalHeader";
import { EventDetailModalShellBody } from "./EventDetailModalShellBody/EventDetailModalShellBody";

type EventDetailModalShellProps = {
  open: boolean;
  duration: number;
  event: CalendarEvent;
  title: string;
  state: UseEventDetailModalReturn;
  onDeleteClick: () => void;
  onClose: () => void;
};

export function EventDetailModalShell({
  duration,
  event,
  title,
  state,
  onDeleteClick,
  onClose,
}: EventDetailModalShellProps) {
  const { menuOpen, setMenuOpen, menuRef, editing, isCreator, openEditMode, handleOverlayClick } =
    state;

  return (
    <EventDetailModalOverlay duration={duration} onOverlayClick={handleOverlayClick}>
      <EventDetailModalPanel duration={duration}>
        <EventDetailModalHeader
          title={title}
          isCreator={isCreator}
          editing={editing}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          menuRef={menuRef}
          onEditClick={openEditMode}
          onDeleteClick={onDeleteClick}
          onClose={onClose}
        />
        <EventDetailModalShellBody event={event} state={state} />
      </EventDetailModalPanel>
    </EventDetailModalOverlay>
  );
}
