"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { updateEvent } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { parseUpdateEventParams } from "@/features/calendar/schemas";

export async function updateEventAction(
  eventId: string,
  params: { title?: string; description?: string | null; eventDate?: string }
): Promise<{ error: string | null }> {
  const parsed = parseUpdateEventParams({ eventId, ...params });
  if (!parsed.success) return { error: getFirstZodError(parsed) };
  const { eventId: id, ...rest } = parsed.data;
  const payload = {
    ...(rest.title !== undefined && { title: rest.title }),
    ...(rest.description !== undefined && { description: rest.description }),
    ...(rest.eventDate !== undefined && { eventDate: rest.eventDate }),
  };
  const { error } = await updateEvent(id, payload);
  if (!error) revalidatePath(PATHS.CALENDAR);
  return { error };
}
