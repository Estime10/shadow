"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { createEvent } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { parseCreateEventParams } from "@/features/calendar/schemas";

export type CreateEventActionParams = {
  title: string;
  description: string | null;
  eventDate: string;
};

export async function createEventAction(params: unknown): Promise<{ error: string | null }> {
  const parsed = parseCreateEventParams(params);
  if (!parsed.success) return { error: getFirstZodError(parsed) };
  const { error } = await createEvent({
    title: parsed.data.title,
    description: parsed.data.description,
    eventDate: parsed.data.eventDate,
  });
  if (error) return { error };
  revalidatePath(PATHS.CALENDAR);
  return { error: null };
}
