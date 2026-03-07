import type { CalendarEvent } from "@/features/calendar/types";
import type { EventRow } from "../types/types";

/**
 * Mappe une ligne DB event vers le type CalendarEvent du domaine.
 */
export function mapEventRowToCalendarEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    eventDate: row.event_date,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
