"use server";

import { revalidatePath } from "next/cache";
import { deleteMessage } from "@/lib/supabase/CRUD";

export async function deleteMessageAction(
  formData: FormData
): Promise<{ error: string | null; conversationDeleted?: boolean }> {
  const messageId = (formData.get("messageId") as string)?.trim();
  const conversationId = (formData.get("conversationId") as string)?.trim();
  if (!messageId) return { error: "ID manquant" };

  const { error, conversationDeleted } = await deleteMessage(messageId, conversationId || null);
  if (error) return { error };

  revalidatePath("/messages");
  if (conversationId) revalidatePath(`/messages/${conversationId}`);
  return { error: null, conversationDeleted };
}
