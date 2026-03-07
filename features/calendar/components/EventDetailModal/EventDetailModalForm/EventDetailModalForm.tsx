"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { EventDetailModalFormFields } from "./EventDetailModalFormFields/EventDetailModalFormFields";
import { EventDetailModalFormActions } from "./EventDetailModalFormActions/EventDetailModalFormActions";

type EventDetailModalFormProps = {
  event: CalendarEvent;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  editTime: string;
  setEditTime: React.Dispatch<React.SetStateAction<string>>;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function EventDetailModalForm({
  event,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editTime,
  setEditTime,
  onSave,
  onCancel,
}: EventDetailModalFormProps) {
  return (
    <form onSubmit={onSave} className="flex flex-col gap-4">
      <EventDetailModalFormFields
        event={event}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editTime={editTime}
        setEditTime={setEditTime}
      />
      <EventDetailModalFormActions onCancel={onCancel} />
    </form>
  );
}
