import { z } from "zod";

export const deleteEventSchema = z.object({
  eventId: z.string().uuid("ID événement invalide"),
});

export function parseDeleteEventParams(eventId: unknown) {
  return deleteEventSchema.shape.eventId.safeParse(eventId);
}
