"use client";

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { MessageIdHeader, MessageIdContent, ThreadRealtime } from "@/features/messages/components";
import { getThreadDataAction, markMessagesAsReadAction } from "@/features/messages/actions";
import { ROOM_CONVERSATION_ID } from "@/features/messages/constants";
import type { MessageIdPageContent } from "@/features/messages/types";

export type ThreadWithCacheProps = {
  initial: MessageIdPageContent;
  conversationId: string;
  withUserId?: string | null;
};

function buildThreadKey(
  conversationId: string,
  withUserId?: string | null
): readonly [string, string, string?] {
  if (conversationId === ROOM_CONVERSATION_ID) {
    return ["thread", "room", withUserId ?? ""];
  }
  return ["thread", conversationId];
}

/**
 * Affiche le thread avec cache SWR. Données initiales du serveur en fallback ;
 * Realtime met à jour le cache (insert/update/delete message) sans refetch.
 * À l'affichage du thread, marque les messages comme lus (marquer comme lu).
 */
export function ThreadWithCache({ initial, conversationId, withUserId }: ThreadWithCacheProps) {
  const threadKey = buildThreadKey(conversationId, withUserId);
  const { data, mutate } = useSWR<MessageIdPageContent | null>(
    threadKey,
    () => getThreadDataAction({ conversationId, withUserId }),
    { fallbackData: initial }
  );
  const content = data ?? initial;
  const markedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!content.currentUserId || content.messages.length === 0) return;
    const lastId = content.messages[content.messages.length - 1]?.id ?? "";
    const cacheKey = `${threadKey.join(",")}-${content.messages.length}-${lastId}`;
    if (markedRef.current === cacheKey) return;
    markedRef.current = cacheKey;
    // Marquer comme lu uniquement les messages reçus (pas ceux que j'ai envoyés)
    const ids = content.messages
      .filter((m) => m.senderId !== content.currentUserId)
      .map((m) => m.id);
    void markMessagesAsReadAction(ids);
  }, [content.currentUserId, content.messages, conversationId, threadKey, mutate]);

  return (
    <>
      <MessageIdHeader conversation={content.conversation} />
      <ThreadRealtime
        conversationId={conversationId}
        currentUserId={content.currentUserId}
        threadCacheKey={threadKey}
      />
      <MessageIdContent {...content} threadCacheKey={threadKey} />
    </>
  );
}
