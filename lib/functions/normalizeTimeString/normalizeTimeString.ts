/**
 * Normalise une chaîne saisie par l’utilisateur en heure HH:mm valide.
 * Accepte notamment : "14:30", "14h30", "1430", "9:00", "09:00".
 * Une fonction = un sous-dossier. Logique métier temps (pas d’UI).
 */

/**
 * Retourne l’heure au format HH:mm (heures 0–23, minutes 0–59 clampées). Sinon null si chaîne vide ou invalide.
 */
export function normalizeTimeString(input: string): string | null {
  const trimmed = input.trim().replace(/\s/g, "");
  if (trimmed === "") return null;

  const withColon = trimmed.replace(/h|H/g, ":");
  const parts = withColon.split(":");
  const first = parts[0] ?? "";
  const second = parts[1] ?? "";

  let h: number;
  let m: number;

  if (parts.length === 1) {
    const digits = first.replace(/\D/g, "");
    if (digits.length <= 2) {
      h = parseInt(digits, 10) || 0;
      m = 0;
    } else if (digits.length === 3) {
      h = parseInt(digits.slice(0, 1), 10) || 0;
      m = parseInt(digits.slice(1), 10) || 0;
    } else {
      h = parseInt(digits.slice(0, 2), 10) ?? 0;
      m = parseInt(digits.slice(2, 4), 10) ?? 0;
    }
  } else {
    h = parseInt(first, 10) ?? 0;
    m = parseInt(second.slice(0, 2), 10) ?? 0;
  }

  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  const clampedH = Math.min(23, Math.max(0, h));
  const clampedM = Math.min(59, Math.max(0, m));

  return `${String(clampedH).padStart(2, "0")}:${String(clampedM).padStart(2, "0")}`;
}
