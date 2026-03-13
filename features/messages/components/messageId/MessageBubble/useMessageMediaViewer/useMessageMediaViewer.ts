"use client";

import { useState, useCallback } from "react";
import type { MessageMediaType } from "@/types";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { recordMessageMediaViewAction } from "@/features/messages/actions";
import { useInvalidateMessagesCache } from "@/features/messages/lib/useInvalidateMessagesCache/useInvalidateMessagesCache";

export type UseMessageMediaViewerParams = {
  messageId: string;
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
};

export type UseMessageMediaViewerReturn = {
  viewerOpen: boolean;
  viewerPath: string | null;
  viewerType: MessageMediaType | null;
  handleMediaClick: (storagePath: string, type: MessageMediaType) => Promise<void>;
  handleCloseViewer: () => void;
};

/**
 * Logique métier : enregistrement vue média + invalidation cache + état modale.
 * Le composant UI ne fait qu’afficher et appeler ces callbacks.
 */
export function useMessageMediaViewer({
  messageId,
  conversationId,
  threadCacheKey,
}: UseMessageMediaViewerParams): UseMessageMediaViewerReturn {
  const invalidate = useInvalidateMessagesCache();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPath, setViewerPath] = useState<string | null>(null);
  const [viewerType, setViewerType] = useState<MessageMediaType | null>(null);

  const handleMediaClick = useCallback(
    async (storagePath: string, type: MessageMediaType) => {
      await recordMessageMediaViewAction(messageId);
      invalidate({ conversationId, threadCacheKey });
      setViewerPath(storagePath);
      setViewerType(type);
      setViewerOpen(true);
    },
    [messageId, conversationId, threadCacheKey, invalidate]
  );

  const handleCloseViewer = useCallback(() => {
    setViewerOpen(false);
    setViewerPath(null);
    setViewerType(null);
  }, []);

  return {
    viewerOpen,
    viewerPath,
    viewerType,
    handleMediaClick,
    handleCloseViewer,
  };
}
