import { getEvents } from "@/lib/supabase/CRUD";
import type { CalendarEvent } from "@/features/calendar/types";

/**
 * Récupère les événements pour le calendrier (tous, le client filtre par mois).
 */
export async function getEventsForCalendar(): Promise<CalendarEvent[]> {
  return getEvents();
}
