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
          className="shrink-0 w-[200px] max-w-[72vw] sm:w-[240px] sm:max-w-[80vw] md:w-[280px] md:max-w-[85vw] snap-center"
        >
          <EventCard event={event} onClick={onEventClick} compact />
        </div>
      ))}
    </div>
  );
}
