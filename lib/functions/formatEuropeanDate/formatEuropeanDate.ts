/**
 * Formate une date ISO en format européen : jj mois année (ex. "12 mars 2025").
 * Locale fr-FR.
 */
export function formatEuropeanDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formate une date ISO en date + heure européennes : "12 mars 2025, 14h30".
 */
export function formatEuropeanDateTime(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}
