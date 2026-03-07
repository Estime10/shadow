import { z } from "zod";
import {
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENT_DESCRIPTION_LENGTH,
} from "@/features/calendar/constants";

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Titre requis")
      .max(MAX_EVENT_TITLE_LENGTH, "Titre trop long")
      .transform((s) => s.trim()),
    description: z
      .union([z.string(), z.null()])
      .optional()
      .transform((s) => (typeof s === "string" && s.trim() ? s.trim() : null)),
    eventDate: z
      .string()
      .min(1, "Date requise")
      .refine((s) => !Number.isNaN(new Date(s).getTime()), "Date invalide"),
  })
  .refine(
    (data) => data.description === null || data.description.length <= MAX_EVENT_DESCRIPTION_LENGTH,
    { message: "Description trop longue", path: ["description"] }
  );

export type CreateEventSchemaOutput = z.output<typeof createEventSchema>;

export function parseCreateEventParams(params: unknown) {
  return createEventSchema.safeParse(params);
}
