import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

const createMessageRawSchema = z.object({
  conversationId: z
    .string({ message: "Conversation manquante" })
    .min(1, "Conversation manquante")
    .transform((s) => s.trim()),
  text: z
    .string({ message: "Message vide" })
    .min(1, "Message vide")
    .max(MAX_MESSAGE_LENGTH, "Message trop long")
    .transform((s) => s.trim()),
});

/**
 * Parse FormData pour createMessageAction.
 * Toute donnée externe (formData) doit être validée avant usage.
 */
export function parseCreateMessageFormData(formData: FormData) {
  const raw = {
    conversationId: formData.get("conversationId"),
    text: formData.get("text"),
  };
  return createMessageRawSchema.safeParse(raw);
}

export type CreateMessageSchemaOutput = z.output<typeof createMessageRawSchema>;
