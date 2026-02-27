"use server";

import { revalidatePath } from "next/cache";
import { createMessage } from "@/lib/supabase/CRUD";
import { parseCreateMessageFormData } from "@/features/messages/schemas";

export async function createMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = parseCreateMessageFormData(formData);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = first.conversationId?.[0] ?? first.text?.[0] ?? "Données invalides";
    return { error: message };
  }

  const { conversationId, text } = parsed.data;
  const { error } = await createMessage(conversationId, text);
  if (error) return { error };

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  return { error: null };
}
