"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { EventCarousel } from "../../EventCarousel/EventCarousel";

type CalendarViewEventsSectionProps = {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

export function CalendarViewEventsSection({
  events,
  onEventClick,
}: CalendarViewEventsSectionProps) {
  return (
    <section className="flex-1 min-h-0 flex flex-col" aria-label="Événements du mois">
      <div className="pt-4 sm:pt-10">
        <EventCarousel events={events} onEventClick={onEventClick} />
      </div>
    </section>
  );
}
