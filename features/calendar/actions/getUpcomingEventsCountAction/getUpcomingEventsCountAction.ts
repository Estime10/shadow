"use server";

import { getUpcomingEventsCount } from "@/lib/supabase/CRUD";

export type GetUpcomingEventsCountResult = { count: number };

/**
 * Nombre d'événements à partir d'aujourd'hui.
 * Utilisé pour le badge Calendrier dans la nav.
 */
export async function getUpcomingEventsCountAction(): Promise<GetUpcomingEventsCountResult> {
  const count = await getUpcomingEventsCount();
  return { count };
}
