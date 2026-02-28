"use client";

import { MessageIdHeader, MessageIdContent, ThreadRealtime } from "@/features/messages/components";
import { useThreadWithCache } from "./useThreadWithCache/useThreadWithCache";
import type { MessageIdPageContent } from "@/features/messages/types";

export type ThreadWithCacheProps = {
  initial: MessageIdPageContent;
  conversationId: string;
  withUserId?: string | null;
};

export function ThreadWithCache({ initial, conversationId, withUserId }: ThreadWithCacheProps) {
  const { content, threadKey } = useThreadWithCache({ initial, conversationId, withUserId });

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
