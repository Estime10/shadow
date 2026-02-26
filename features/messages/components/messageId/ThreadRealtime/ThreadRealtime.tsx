"use client";

import { useMessagesRealtime } from "@/features/messages/hooks";

type ThreadRealtimeProps = {
  conversationId: string;
  currentUserId?: string | null;
};

/**
 * S'abonne aux messages (INSERT/UPDATE/DELETE) et conversations (DELETE) pour cette conversation.
 * currentUserId permet le même canal que la liste et une reconnexion cohérente après navigation.
 */
export function ThreadRealtime({ conversationId, currentUserId }: ThreadRealtimeProps) {
  useMessagesRealtime([conversationId], currentUserId);
  return null;
}
