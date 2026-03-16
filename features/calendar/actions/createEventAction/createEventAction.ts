"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { createEvent } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { getClientIdentifier, isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";
import { parseCreateEventParams } from "@/features/calendar/schemas";

export type CreateEventActionParams = {
  title: string;
  description: string | null;
  eventDate: string;
};

const CREATE_EVENT_RATE_LIMIT = 30; // événements par 15 min et par IP

export async function createEventAction(params: unknown): Promise<{ error: string | null }> {
  const identifier = await getClientIdentifier();
  const key = `calendar:create:${identifier}`;
  if (isRateLimited(key, CREATE_EVENT_RATE_LIMIT)) {
    return { error: RATE_LIMIT_MESSAGE };
  }

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
