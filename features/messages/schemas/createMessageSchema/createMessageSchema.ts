import { z } from "zod";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

const CREATE_MESSAGE_KEYS = ["conversationId", "text"] as const;

const createMessageRawSchema = z.object({
  conversationId: z
    .string({ message: "Conversation manquante" })
    .uuid("ID conversation invalide")
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
  return createMessageRawSchema.safeParse(getFormDataRaw(formData, CREATE_MESSAGE_KEYS));
}

export type CreateMessageSchemaOutput = z.output<typeof createMessageRawSchema>;
