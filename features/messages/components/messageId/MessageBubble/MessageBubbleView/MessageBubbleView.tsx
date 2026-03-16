"use client";

import dynamic from "next/dynamic";
import type { MessageMediaType } from "@/types";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { useMessageMediaViewer } from "../useMessageMediaViewer/useMessageMediaViewer";
import { MessageBubbleContent } from "../MessageBubbleContent/MessageBubbleContent";
import { MessageBubbleFooter } from "../MessageBubbleFooter/MessageBubbleFooter";

const MessageMediaViewerModal = dynamic(
  () =>
    import("../MessageMediaViewerModal/MessageMediaViewerModal").then((m) => ({
      default: m.MessageMediaViewerModal,
    })),
  { ssr: false }
);

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
  const { viewerOpen, viewerPath, viewerType, handleMediaClick, handleCloseViewer } =
    useMessageMediaViewer({ messageId, conversationId, threadCacheKey });

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
