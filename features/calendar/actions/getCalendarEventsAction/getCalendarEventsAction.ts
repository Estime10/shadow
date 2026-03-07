"use server";

import { getEventsForCalendar } from "@/features/calendar/data";
import type { CalendarEvent } from "@/features/calendar/types";

/**
 * Données pour le calendrier (liste d’événements).
 * Utilisé par SWR côté client pour refetch / cache.
 */
export async function getCalendarEventsAction(): Promise<CalendarEvent[]> {
  return getEventsForCalendar();
}
