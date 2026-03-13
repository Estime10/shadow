"use client";

import { useState, useCallback } from "react";
import { useSWRConfig } from "swr";
import type { MessageMediaType } from "@/types";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { recordMessageMediaViewAction } from "@/features/messages/actions";
import { MessageBubbleContent } from "../MessageBubbleContent/MessageBubbleContent";
import { MessageBubbleFooter } from "../MessageBubbleFooter/MessageBubbleFooter";
import { MessageMediaViewerModal } from "../MessageMediaViewerModal/MessageMediaViewerModal";

type MessageBubbleViewProps = {
  text: string;
  mediaUrl?: string | null;
  mediaType?: MessageMediaType | null;
  mediaViewedByMe?: boolean;
  createdAt: string;
  messageId: string;
  conversationId: string;
  isSent: boolean;
  readByRecipient?: boolean;
  menuOpen: boolean;
  onEdit: () => void;
  onMenuToggle: () => void;
  setMenuOpen: (open: boolean) => void;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageBubbleView({
  text,
  mediaUrl = null,
  mediaType = null,
  mediaViewedByMe = false,
  createdAt,
  messageId,
  conversationId,
  isSent,
  readByRecipient = false,
  menuOpen,
  onEdit,
  onMenuToggle,
  setMenuOpen,
  threadCacheKey,
}: MessageBubbleViewProps) {
  const { mutate } = useSWRConfig();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPath, setViewerPath] = useState<string | null>(null);
  const [viewerType, setViewerType] = useState<MessageMediaType | null>(null);

  const handleMediaClick = useCallback(
    async (storagePath: string, type: MessageMediaType) => {
      await recordMessageMediaViewAction(messageId);
      void mutate(threadCacheKey ?? ["thread", conversationId]);
      setViewerPath(storagePath);
      setViewerType(type);
      setViewerOpen(true);
    },
    [messageId, conversationId, threadCacheKey, mutate]
  );

  const handleCloseViewer = useCallback(() => {
    setViewerOpen(false);
    setViewerPath(null);
    setViewerType(null);
  }, []);

  return (
    <>
      <div
        className={`relative w-full max-w-[min(85%,20rem)] rounded-2xl content-px py-2.5 min-w-0 ${
          isSent
            ? "rounded-br-md bg-(--accent)/15 text-(--text)"
            : "rounded-bl-md bg-surface text-(--text)"
        }`}
      >
        <MessageBubbleContent
          text={text}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
          mediaViewedByMe={mediaViewedByMe}
          onMediaClick={handleMediaClick}
        />
        <MessageBubbleFooter
          createdAt={createdAt}
          isSent={isSent}
          readByRecipient={readByRecipient}
          messageId={messageId}
          conversationId={conversationId}
          menuOpen={menuOpen}
          onEdit={onEdit}
          onMenuToggle={onMenuToggle}
          setMenuOpen={setMenuOpen}
          threadCacheKey={threadCacheKey}
        />
      </div>
      <MessageMediaViewerModal
        open={viewerOpen}
        onClose={handleCloseViewer}
        storagePath={viewerPath}
        mediaType={viewerType}
      />
    </>
  );
}
