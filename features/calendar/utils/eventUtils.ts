import type { CalendarEvent } from "@/features/calendar/types";
import { toDateOnlyISO } from "./dateUtils";

export type AddEventFormValues = {
  title: string;
  description: string;
  time: string;
};

/** Construit un CalendarEvent à partir de la date sélectionnée et des champs du formulaire. */
export function buildEventFromForm(selectedDate: Date, form: AddEventFormValues): CalendarEvent {
  const [hours, minutes] = form.time.split(":").map(Number);
  const eventDate = new Date(selectedDate);
  eventDate.setHours(hours, minutes, 0, 0);
  return {
    id: crypto.randomUUID(),
    title: form.title.trim(),
    description: form.description.trim() || null,
    eventDate: eventDate.toISOString(),
    createdBy: "current-user",
    createdAt: new Date().toISOString(),
  };
}

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

/** Événements dont la date (jour) correspond à la date donnée. */
export function filterEventsByDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const key = toDateOnlyISO(date);
  return events.filter((e) => toDateOnlyISO(new Date(e.eventDate)) === key);
}

/** Événements à partir d'aujourd'hui (date du jour 00:00:00 incluse). */
export function filterEventsFromToday(events: CalendarEvent[], today: Date): CalendarEvent[] {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startTime = start.getTime();
  return events.filter((e) => new Date(e.eventDate).getTime() >= startTime);
}
