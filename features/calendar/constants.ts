/**
 * Constantes partagées pour la feature calendar.
 */

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

export const MONTH_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

/** Longueur max titre d'événement (côté serveur + client). */
export const MAX_EVENT_TITLE_LENGTH = 200;
/** Longueur max description d'événement. */
export const MAX_EVENT_DESCRIPTION_LENGTH = 2000;
