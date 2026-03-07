"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import type { UseEventDetailModalReturn } from "@/features/calendar/hooks";
import { EventDetailModalForm } from "@/features/calendar/components/EventDetailModal/EventDetailModalForm/EventDetailModalForm";
import { EventDetailModalView } from "@/features/calendar/components/EventDetailModal/EventDetailModalView/EventDetailModalView";

type EventDetailModalShellBodyProps = {
  event: CalendarEvent;
  state: UseEventDetailModalReturn;
  onUpdateSuccess?: () => void;
};

export function EventDetailModalShellBody({
  event,
  state,
  onUpdateSuccess,
}: EventDetailModalShellBodyProps) {
  const { editing, setEditing, handleCancelEdit } = state;

  const handleSaveSuccess = () => {
    setEditing(false);
    onUpdateSuccess?.();
  };

  return (
    <div className="content-px py-4 space-y-4">
      {editing ? (
        <EventDetailModalForm
          event={event}
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <EventDetailModalView event={event} />
      )}
    </div>
  );
}
