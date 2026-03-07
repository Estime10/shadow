"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { formatEventDateTime } from "@/features/calendar/utils";

type EventDetailModalViewProps = {
  event: CalendarEvent;
};

export function EventDetailModalView({ event }: EventDetailModalViewProps) {
  return (
    <>
      <div>
        <span className="block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1">
          Date et heure
        </span>
        <time dateTime={event.eventDate} className="font-display text-sm text-(--text)">
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
  );
}
