"use server";

import { revalidatePath } from "next/cache";
import { updateMessage } from "@/lib/supabase/CRUD";

export async function updateMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const messageId = (formData.get("messageId") as string)?.trim();
  const text = (formData.get("text") as string)?.trim();
  if (!messageId || !text) return { error: "Données invalides" };

  const { error } = await updateMessage(messageId, text);
  if (error) return { error };

  revalidatePath("/messages");
  return { error: null };
}
