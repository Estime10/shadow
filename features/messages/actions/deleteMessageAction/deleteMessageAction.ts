"use server";

import { revalidatePath } from "next/cache";
import { deleteMessage } from "@/lib/supabase/CRUD";
import { parseDeleteMessageFormData } from "@/features/messages/schemas";

export async function deleteMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = parseDeleteMessageFormData(formData);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = first.messageId?.[0] ?? "Données invalides";
    return { error: message };
  }

  const { messageId, conversationId } = parsed.data;
  const { error } = await deleteMessage(messageId, conversationId ?? null);
  if (error) return { error };

  revalidatePath("/messages");
  if (conversationId) revalidatePath(`/messages/${conversationId}`);
  return { error: null };
}
