"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { formatDateLabel } from "@/features/calendar/utils";
import { EventDetailModalFormTitleField } from "./EventDetailModalFormTitleField/EventDetailModalFormTitleField";
import { EventDetailModalFormTimeField } from "./EventDetailModalFormTimeField/EventDetailModalFormTimeField";
import { EventDetailModalFormDescriptionField } from "./EventDetailModalFormDescriptionField/EventDetailModalFormDescriptionField";

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
      <EventDetailModalFormTitleField value={editTitle} onChange={setEditTitle} />
      <EventDetailModalFormTimeField value={editTime} onChange={setEditTime} />
      <EventDetailModalFormDescriptionField value={editDescription} onChange={setEditDescription} />
    </>
  );
}
