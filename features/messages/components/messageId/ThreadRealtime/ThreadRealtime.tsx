"use client";

import { useMessagesRealtime, type ThreadCacheKey } from "@/lib/hooks/messages";

type ThreadRealtimeProps = {
  conversationId: string;
  currentUserId?: string | null;
  /** Clé SWR du cache thread pour mise à jour ciblée (sans refetch) depuis Realtime. */
  threadCacheKey?: ThreadCacheKey;
};

/**
 * S'abonne aux messages (INSERT/UPDATE/DELETE) et conversations (DELETE) pour cette conversation.
 * Si threadCacheKey est fourni, met à jour le cache SWR du thread à partir du payload Realtime.
 */
export function ThreadRealtime({
  conversationId,
  currentUserId,
  threadCacheKey,
}: ThreadRealtimeProps) {
  useMessagesRealtime([conversationId], currentUserId, { threadCacheKey });
  return null;
}
