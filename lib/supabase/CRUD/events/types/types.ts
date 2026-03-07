/**
 * Types pour le domaine events (public.events).
 */

/** Ligne brute retournée par Supabase (events). */
export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_by: string;
  created_at: string;
};
