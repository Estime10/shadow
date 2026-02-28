"use client";

import type { ThreadCacheKey } from "@/features/messages/hooks";
import { MessageBubbleContent } from "../MessageBubbleContent/MessageBubbleContent";
import { MessageBubbleFooter } from "../MessageBubbleFooter/MessageBubbleFooter";

type MessageBubbleViewProps = {
  text: string;
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
  return (
    <div
      className={`relative w-full max-w-[min(85%,20rem)] rounded-2xl content-px py-2.5 min-w-0 ${
        isSent
          ? "rounded-br-md bg-(--accent)/15 text-(--text)"
          : "rounded-bl-md bg-surface text-(--text)"
      }`}
    >
      <MessageBubbleContent text={text} />
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
  );
}
