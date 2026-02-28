/**
 * Types pour le domaine conversations (public.conversations).
 */

export type ConversationRow = {
  id: string;
  type: "direct" | "group";
  user_1_id: string | null;
  user_2_id: string | null;
  group_id: string | null;
  created_at: string;
};
