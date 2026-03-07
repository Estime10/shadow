"use server";

import { revalidatePath } from "next/cache";
import { createEvent } from "@/lib/supabase/CRUD";

export type CreateEventActionParams = {
  title: string;
  description: string | null;
  eventDate: string;
};

export async function createEventAction(
  params: CreateEventActionParams
): Promise<{ error: string | null }> {
  const { error } = await createEvent({
    title: params.title,
    description: params.description,
    eventDate: params.eventDate,
  });
  if (error) return { error };
  revalidatePath("/calendar");
  return { error: null };
}
