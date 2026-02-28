import type { CalendarEvent } from "@/features/calendar/types";
import { EventCard } from "../EventCard/EventCard";

export type EventListProps = {
  events: CalendarEvent[];
  emptyMessage?: string;
  onEventClick?: (event: CalendarEvent) => void;
};

export function EventList({
  events,
  emptyMessage = "Aucun événement ce mois-ci.",
  onEventClick,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="content-px py-6 font-display text-sm text-(--text-muted)">{emptyMessage}</p>
    );
  }
  return (
    <ul className="content-px space-y-1.5 py-4" role="list">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} onClick={onEventClick} />
        </li>
      ))}
    </ul>
  );
}
