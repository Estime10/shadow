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
      <h2 className="content-px pt-4 font-display text-sm font-bold uppercase tracking-wider text-(--text-muted)">
        Événements
      </h2>
      <EventCarousel events={events} onEventClick={onEventClick} />
    </section>
  );
}
