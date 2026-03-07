import { z } from "zod";
import {
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENT_DESCRIPTION_LENGTH,
} from "@/features/calendar/constants";

/** Schéma pour le formulaire événement (création et édition). Champs: title, description, time. */
export const eventFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Titre requis")
      .max(MAX_EVENT_TITLE_LENGTH, "Titre trop long")
      .transform((s) => s.trim()),
    description: z
      .string()
      .optional()
      .transform((s) => (typeof s === "string" && s.trim() ? s.trim() : "")),
    time: z
      .string()
      .min(1, "Heure requise")
      .regex(/^\d{1,2}:\d{2}$/, "Heure invalide (ex: 14:30)"),
  })
  .refine((data) => (data.description ?? "").length <= MAX_EVENT_DESCRIPTION_LENGTH, {
    message: "Description trop longue",
    path: ["description"],
  });

export type EventFormValues = z.output<typeof eventFormSchema>;
