"use server";

import { revalidatePath } from "next/cache";
import { createMessage } from "@/lib/supabase/CRUD";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

export async function createMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const conversationId = (formData.get("conversationId") as string)?.trim();
  const text = (formData.get("text") as string)?.trim();
  if (!conversationId || !text) return { error: "Données invalides" };
  if (text.length > MAX_MESSAGE_LENGTH) return { error: "Message trop long" };

  const { error } = await createMessage(conversationId, text);
  if (error) return { error };

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  return { error: null };
}
