import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
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
  const auth = await requireUser(supabase);
  if ("error" in auth) return { event: null, error: auth.error };
  const { user } = auth;

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
