"use server";

import { revalidatePath } from "next/cache";
import { updateMessage } from "@/lib/supabase/CRUD";
import { parseUpdateMessageFormData } from "@/features/messages/schemas";

export async function updateMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = parseUpdateMessageFormData(formData);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = first.messageId?.[0] ?? first.text?.[0] ?? "Données invalides";
    return { error: message };
  }

  const { messageId, text, conversationId } = parsed.data;
  const { error } = await updateMessage(messageId, text);
  if (error) return { error };

  revalidatePath("/messages");
  if (conversationId) revalidatePath(`/messages/${conversationId}`);
  return { error: null };
}
