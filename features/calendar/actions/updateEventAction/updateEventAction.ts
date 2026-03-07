"use server";

import { revalidatePath } from "next/cache";
import { updateEvent } from "@/lib/supabase/CRUD";
import type { UpdateEventParams } from "@/lib/supabase/CRUD";

export async function updateEventAction(
  eventId: string,
  params: UpdateEventParams
): Promise<{ error: string | null }> {
  const { error } = await updateEvent(eventId, params);
  if (!error) revalidatePath("/calendar");
  return { error };
}
