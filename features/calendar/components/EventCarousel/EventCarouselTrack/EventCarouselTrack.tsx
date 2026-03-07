"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { EventCard } from "@/features/calendar/components/EventCard/EventCard";

type EventCarouselTrackProps = {
  events: CalendarEvent[];
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onEventClick?: (event: CalendarEvent) => void;
};

export function EventCarouselTrack({ events, cardRefs, onEventClick }: EventCarouselTrackProps) {
  return (
    <div className="flex gap-3 justify-center lg:justify-start min-w-min">
      {events.map((event, i) => (
        <div
          key={event.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="flex-shrink-0 w-[280px] max-w-[85vw] snap-center"
        >
          <EventCard event={event} onClick={onEventClick} />
        </div>
      ))}
    </div>
  );
}
