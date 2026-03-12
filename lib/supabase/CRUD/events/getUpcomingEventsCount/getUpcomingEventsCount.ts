import { createClient } from "../../../server";

/**
 * Nombre d'événements à partir d'aujourd'hui (00:00:00 UTC).
 * Utilisé pour le badge Calendrier dans la nav.
 */
export async function getUpcomingEventsCount(): Promise<number> {
  const now = new Date();
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  );
  const from = startOfToday.toISOString();

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .gte("event_date", from);

  if (error) return 0;
  return Math.max(0, count ?? 0);
}
