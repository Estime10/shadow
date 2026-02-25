/**
 * Types pour le domaine messages (public.messages).
 */

/** Ligne brute retournée par Supabase (messages). */
export type MessageRow = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  text: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  expires_at: string | null;
};

/** Valeur fallback pour messages sans conversation_id (anciennes données). */
export const ROOM_CONVERSATION_ID = "room";
