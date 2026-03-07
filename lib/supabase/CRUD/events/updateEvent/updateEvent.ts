import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";
import { mapEventRowToCalendarEvent } from "../mappers/mappers";
import type { CalendarEvent } from "@/features/calendar/types";

export type UpdateEventParams = {
  title?: string;
  description?: string | null;
  eventDate?: string;
};

/**
 * Met à jour un événement. RLS : seul le créateur peut modifier.
 */
export async function updateEvent(
  eventId: string,
  params: UpdateEventParams
): Promise<{ event: CalendarEvent | null; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { event: null, error: auth.error };
  const { user } = auth;

  const payload: Record<string, string | null> = {};
  if (params.title !== undefined) payload.title = params.title.trim();
  if (params.description !== undefined) payload.description = params.description?.trim() || null;
  if (params.eventDate !== undefined) payload.event_date = params.eventDate;

  if (Object.keys(payload).length === 0) {
    return { event: null, error: "Aucun champ à mettre à jour" };
  }

  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", eventId)
    .eq("created_by", user.id)
    .select("id, title, description, event_date, created_by, created_at")
    .maybeSingle();

  if (error) return { event: null, error: error.message };
  if (!data) {
    return {
      event: null,
      error: "Événement introuvable ou non autorisé",
    };
  }
  return { event: mapEventRowToCalendarEvent(data), error: null };
}
