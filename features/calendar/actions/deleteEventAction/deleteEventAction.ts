"use server";

import { revalidatePath } from "next/cache";
import { deleteEvent } from "@/lib/supabase/CRUD";

export async function deleteEventAction(
  eventId: string
): Promise<{ ok: boolean; error: string | null }> {
  const result = await deleteEvent(eventId);
  if (result.ok) revalidatePath("/calendar");
  return result;
}
