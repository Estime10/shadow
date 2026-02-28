/**
 * Types pour le domaine profiles (public.users).
 */

/** Valeurs autorisées pour la disparition du message après lecture (min). */
export const MESSAGE_DISAPPEAR_MINUTES_OPTIONS = [15, 30, 45, 60] as const;
export type MessageDisappearAfterMinutes = (typeof MESSAGE_DISAPPEAR_MINUTES_OPTIONS)[number];

export type CurrentUserProfile = {
  id: string;
  username: string | null;
  /** Délai (min) avant disparition du message après lecture pour cet user (15, 30, 45, 60). */
  messageDisappearAfterMinutes: number;
};

export type Profile = {
  id: string;
  username: string | null;
};

/** Ligne brute retournée par Supabase (users). */
export type ProfileRow = {
  id: string;
  username: string | null;
  message_disappear_after_minutes: number | null;
};
