import { createClient } from "../../../server";
import { mapEventRowToCalendarEvent } from "../mappers/mappers";
import type { CalendarEvent } from "@/features/calendar/types";

/**
 * Récupère les événements (tous ou filtrés par plage de dates).
 * RLS : tous les utilisateurs authentifiés peuvent lire.
 */
export async function getEvents(options?: {
  from?: string;
  to?: string;
}): Promise<CalendarEvent[]> {
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select("id, title, description, event_date, created_by, created_at")
    .order("event_date", { ascending: true });

  if (options?.from) {
    query = query.gte("event_date", options.from);
  }
  if (options?.to) {
    query = query.lte("event_date", options.to);
  }

  const { data, error } = await query;

  if (error) return [];

  return (data ?? []).map(mapEventRowToCalendarEvent);
}
