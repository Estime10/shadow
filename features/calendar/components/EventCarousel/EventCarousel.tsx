"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { EventCarouselNav } from "./EventCarouselNav/EventCarouselNav";
import { EventCarouselTrack } from "./EventCarouselTrack/EventCarouselTrack";
import { useEventCarouselNav } from "./useEventCarouselNav/useEventCarouselNav";

export type EventCarouselProps = {
  events: CalendarEvent[];
  emptyMessage?: string;
  onEventClick?: (event: CalendarEvent) => void;
};

export function EventCarousel({
  events,
  emptyMessage = "Aucun événement ce mois-ci.",
  onEventClick,
}: EventCarouselProps) {
  const { cardRefs, clampedIndex, goPrev, goNext } = useEventCarouselNav({
    eventsLength: events.length,
  });

  if (events.length === 0) {
    return (
      <p className="content-px py-6 font-display text-sm text-(--text-muted)">{emptyMessage}</p>
    );
  }

  return (
    <div className="relative content-px py-4">
      <EventCarouselNav
        onPrev={goPrev}
        onNext={goNext}
        canGoPrev={clampedIndex > 0}
        canGoNext={clampedIndex < events.length - 1}
      >
        <EventCarouselTrack events={events} cardRefs={cardRefs} onEventClick={onEventClick} />
      </EventCarouselNav>
    </div>
  );
}
