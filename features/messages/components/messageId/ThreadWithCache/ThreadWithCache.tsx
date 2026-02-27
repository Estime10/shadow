"use client";

import useSWR from "swr";
import { MessageIdHeader, MessageIdContent, ThreadRealtime } from "@/features/messages/components";
import { getThreadDataAction } from "@/features/messages/actions";
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
 */
export function ThreadWithCache({ initial, conversationId, withUserId }: ThreadWithCacheProps) {
  const threadKey = buildThreadKey(conversationId, withUserId);
  const { data } = useSWR<MessageIdPageContent | null>(
    threadKey,
    () => getThreadDataAction({ conversationId, withUserId }),
    { fallbackData: initial }
  );
  const content = data ?? initial;

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
