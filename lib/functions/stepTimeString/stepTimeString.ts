/**
 * Incrémente ou décrémente une heure au format HH:mm d'un pas en minutes.
 * Une fonction = un sous-dossier. Logique métier temps (pas d'UI).
 */

const MINUTES_PER_DAY = 24 * 60;

function parseTimeToMinutes(value: string): number {
  const parts = value.split(":");
  const h = Math.min(23, Math.max(0, parseInt(parts[0] ?? "0", 10) || 0));
  const m = Math.min(59, Math.max(0, parseInt(parts[1] ?? "0", 10) || 0));
  return h * 60 + m;
}

function formatMinutesToTime(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/**
 * Retourne la nouvelle heure (HH:mm) en avançant ou reculant vers le palier précédent/suivant.
 * Ex. step 15 : 12:59 + flèche haut → 13:00 (pas 13:14). 13:01 + flèche bas → 13:00.
 * @param value - Heure au format HH:mm
 * @param stepMinutes - Pas en minutes (ex. 15), définit les paliers :00, :15, :30, :45
 * @param direction - 1 pour palier suivant, -1 pour palier précédent
 */
export function stepTimeString(value: string, stepMinutes: number, direction: 1 | -1): string {
  const totalMinutes = parseTimeToMinutes(value);
  const m = totalMinutes % 60;
  const r = m % stepMinutes;

  const delta =
    direction === 1 ? (r === 0 ? stepMinutes : stepMinutes - r) : r === 0 ? stepMinutes : r;

  const next = (totalMinutes + direction * delta + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return formatMinutesToTime(next);
}
