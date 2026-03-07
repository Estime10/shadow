import { z } from "zod";
import {
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENT_DESCRIPTION_LENGTH,
} from "@/features/calendar/constants";

export const updateEventSchema = z.object({
  eventId: z.string().uuid("ID événement invalide"),
  title: z
    .string()
    .min(1, "Titre requis")
    .max(MAX_EVENT_TITLE_LENGTH, "Titre trop long")
    .transform((s) => s.trim())
    .optional(),
  description: z
    .union([z.string(), z.null()])
    .optional()
    .transform((s) => (typeof s === "string" && s.trim() ? s.trim() : null)),
  eventDate: z
    .string()
    .min(1)
    .refine((s) => !Number.isNaN(new Date(s).getTime()), "Date invalide")
    .optional(),
});

export const updateEventSchemaRefined = updateEventSchema.refine(
  (data) =>
    data.description === null ||
    data.description === undefined ||
    data.description.length <= MAX_EVENT_DESCRIPTION_LENGTH,
  { message: "Description trop longue", path: ["description"] }
);

export type UpdateEventSchemaOutput = z.output<typeof updateEventSchema>;

export function parseUpdateEventParams(params: unknown) {
  return updateEventSchemaRefined.safeParse(params);
}
