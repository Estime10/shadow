/**
 * Reconstruit une date ISO en ne modifiant que l'heure (HH:mm).
 */
export function buildEventDateFromTime(eventDateISO: string, timeHHmm: string): string {
  const d = new Date(eventDateISO);
  const [h, m] = timeHHmm.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
