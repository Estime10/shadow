import { z } from "zod";

const deleteMessageRawSchema = z.object({
  messageId: z.string().min(1, "Message manquant").trim(),
  conversationId: z
    .union([z.string(), z.null()])
    .optional()
    .transform((s) => (s && s.trim()) || undefined),
});

/**
 * Parse FormData pour deleteMessageAction.
 */
export function parseDeleteMessageFormData(formData: FormData) {
  const raw = {
    messageId: formData.get("messageId"),
    conversationId: formData.get("conversationId"),
  };
  return deleteMessageRawSchema.safeParse(raw);
}

export type DeleteMessageSchemaOutput = z.output<typeof deleteMessageRawSchema>;
