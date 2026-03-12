/**
 * Types "ligne DB" et paramètres CRUD (forme Supabase / requêtes).
 * Une seule source de vérité pour les rows et options de requêtes.
 */

/** Ligne brute Supabase (events). */
export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  created_by: string;
  created_at: string;
};

/** Ligne brute Supabase (messages). */
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

/** Ligne brute Supabase (conversations). */
export type ConversationRow = {
  id: string;
  type: "direct" | "group";
  user_1_id: string | null;
  user_2_id: string | null;
  group_id: string | null;
  created_at: string;
};

/** Ligne brute Supabase (groups). */
export type GroupRow = {
  id: string;
  name: string;
  created_by_user_id: string;
  created_at: string;
};

/** Ligne brute Supabase (message_reads). */
export type MessageReadRow = {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
};

/** Options pour getMessages (filtrage visibilité / disparition). */
export type GetMessagesVisibilityOptions = {
  currentUserId: string;
  disappearAfterMinutes: number;
  /** Ids des autres participants (direct = 1, groupe = N). Mes messages disparaissent pour moi quand au moins un autre les a lus + délai, et au moins 24h après création. */
  otherUserIds?: string[];
};

/** Paramètres création événement. */
export type CreateEventParams = {
  title: string;
  description: string | null;
  eventDate: string;
};

/** Paramètres mise à jour événement. */
export type UpdateEventParams = {
  title?: string;
  description?: string | null;
  eventDate?: string;
};
