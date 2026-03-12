"use client";

import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import { getThreadDataAction, markMessagesAsReadAction } from "@/features/messages/actions";
import { getNotificationsBadgeAction } from "@/features/notifications/actions/getNotificationsBadgeAction/getNotificationsBadgeAction";
import { useNotifications } from "@/lib/contexts/NotificationsContext/NotificationsContext";
import { ROOM_CONVERSATION_ID } from "@/features/messages/constants";
import type { MessageIdPageContent } from "@/features/messages/types";

export type ThreadWithCacheParams = {
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
 * Données du thread avec cache SWR + effet "marquer comme lu".
 * Les données initiales servent de fallback ; le realtime met à jour le cache.
 */
export function useThreadWithCache({ initial, conversationId, withUserId }: ThreadWithCacheParams) {
  const { setUnreadCount } = useNotifications();
  const threadKey = useMemo(
    () => buildThreadKey(conversationId, withUserId),
    [conversationId, withUserId]
  );
  const { data } = useSWR<MessageIdPageContent | null>(
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
    const ids = content.messages
      .filter((m) => m.senderId !== content.currentUserId)
      .map((m) => m.id);
    markMessagesAsReadAction(ids).then(() => {
      getNotificationsBadgeAction().then(({ count }) => setUnreadCount(count));
    });
  }, [content.currentUserId, content.messages, threadKey, setUnreadCount]);

  return { content, threadKey };
}
