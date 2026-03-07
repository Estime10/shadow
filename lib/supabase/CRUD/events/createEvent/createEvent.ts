import { createClient } from "../../../server";
import { mapEventRowToCalendarEvent } from "../mappers/mappers";
import type { CalendarEvent } from "@/features/calendar/types";

export type CreateEventParams = {
  title: string;
  description: string | null;
  eventDate: string;
};

/**
 * Crée un événement. created_by = utilisateur connecté (RLS).
 */
export async function createEvent(
  params: CreateEventParams
): Promise<{ event: CalendarEvent | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { event: null, error: "Non authentifié" };
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: params.title.trim(),
      description: params.description?.trim() || null,
      event_date: params.eventDate,
      created_by: user.id,
    })
    .select("id, title, description, event_date, created_by, created_at")
    .single();

  if (error) return { event: null, error: error.message };
  return { event: mapEventRowToCalendarEvent(data), error: null };
}
