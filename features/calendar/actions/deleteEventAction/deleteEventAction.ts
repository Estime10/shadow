"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { deleteEvent } from "@/lib/supabase/CRUD";
import { parseDeleteEventParams } from "@/features/calendar/schemas";

export async function deleteEventAction(eventId: unknown): Promise<{ error: string | null }> {
  const parsed = parseDeleteEventParams(eventId);
  if (!parsed.success) return { error: "ID événement invalide" };
  const result = await deleteEvent(parsed.data);
  if (!result.error) revalidatePath(PATHS.CALENDAR);
  return { error: result.error };
}
