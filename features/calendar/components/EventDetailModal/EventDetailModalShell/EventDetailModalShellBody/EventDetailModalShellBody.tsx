"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import type { UseEventDetailModalReturn } from "@/features/calendar/hooks";
import { EventDetailModalForm } from "@/features/calendar/components/EventDetailModal/EventDetailModalForm/EventDetailModalForm";
import { EventDetailModalView } from "@/features/calendar/components/EventDetailModal/EventDetailModalView/EventDetailModalView";

type EventDetailModalShellBodyProps = {
  event: CalendarEvent;
  state: UseEventDetailModalReturn;
};

export function EventDetailModalShellBody({ event, state }: EventDetailModalShellBodyProps) {
  const {
    editing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editTime,
    setEditTime,
    handleSaveEdit,
    handleCancelEdit,
  } = state;

  return (
    <div className="content-px py-4 space-y-4">
      {editing ? (
        <EventDetailModalForm
          event={event}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          editTime={editTime}
          setEditTime={setEditTime}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <EventDetailModalView event={event} />
      )}
    </div>
  );
}
