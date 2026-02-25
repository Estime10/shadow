/**
 * Types pour le domaine profiles (public.users).
 */

export type CurrentUserProfile = {
  id: string;
  username: string | null;
};

export type Profile = {
  id: string;
  username: string | null;
};

/** Ligne brute retournée par Supabase (users). */
export type ProfileRow = {
  id: string;
  username: string | null;
};
