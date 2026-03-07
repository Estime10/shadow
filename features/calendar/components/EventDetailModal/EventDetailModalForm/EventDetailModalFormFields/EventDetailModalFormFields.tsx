"use client";

import {
  EventFormDescriptionField,
  EventFormTimeField,
  EventFormTitleField,
} from "@/features/calendar/components/EventFormFields";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatDateLabel } from "@/features/calendar/utils";

type EventDetailModalFormFieldsProps = {
  event: CalendarEvent;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  editTime: string;
  setEditTime: React.Dispatch<React.SetStateAction<string>>;
};

export function EventDetailModalFormFields({
  event,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editTime,
  setEditTime,
}: EventDetailModalFormFieldsProps) {
  return (
    <>
      <p className="font-display text-sm text-(--text-muted)">
        {formatDateLabel(new Date(event.eventDate))}
      </p>
      <EventFormTitleField id="edit-event-title" value={editTitle} onChange={setEditTitle} />
      <EventFormTimeField id="edit-event-time" value={editTime} onChange={setEditTime} />
      <EventFormDescriptionField
        id="edit-event-description"
        value={editDescription}
        onChange={setEditDescription}
      />
    </>
  );
}
