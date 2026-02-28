import type { CalendarEvent } from "@/features/calendar/types";
import { toDateOnlyISO } from "./dateUtils";

export function filterEventsByMonth(
  events: CalendarEvent[],
  year: number,
  month: number
): CalendarEvent[] {
  return events.filter((e) => {
    const d = new Date(e.eventDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function sortEventsByDate(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );
}

export function getEventsCountByDay(events: CalendarEvent[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const e of events) {
    const d = new Date(e.eventDate);
    const key = toDateOnlyISO(d);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}
