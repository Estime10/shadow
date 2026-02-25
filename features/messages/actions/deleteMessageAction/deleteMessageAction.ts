"use server";

import { revalidatePath } from "next/cache";
import { deleteMessage } from "@/lib/supabase/CRUD";

export async function deleteMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const messageId = (formData.get("messageId") as string)?.trim();
  if (!messageId) return { error: "ID manquant" };

  const { error } = await deleteMessage(messageId);
  if (error) return { error };

  revalidatePath("/messages");
  return { error: null };
}
