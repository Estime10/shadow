"use client";

import { useRef } from "react";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { useClickOutside } from "@/lib/hooks/useClickOutside/useClickOutside";
import { MessageBubbleFooterMeta } from "./MessageBubbleFooterMeta/MessageBubbleFooterMeta";
import { MessageBubbleFooterMenu } from "./MessageBubbleFooterMenu/MessageBubbleFooterMenu";

type MessageBubbleFooterProps = {
  createdAt: string;
  isSent: boolean;
  readByRecipient?: boolean;
  messageId: string;
  conversationId: string;
  menuOpen: boolean;
  onEdit: () => void;
  onMenuToggle: () => void;
  setMenuOpen: (open: boolean) => void;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageBubbleFooter({
  createdAt,
  isSent,
  readByRecipient = false,
  messageId,
  conversationId,
  menuOpen,
  onEdit,
  onMenuToggle,
  setMenuOpen,
  threadCacheKey,
}: MessageBubbleFooterProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, menuOpen, () => setMenuOpen(false));

  return (
    <div
      className={`mt-2 flex items-center gap-2 pt-1 ${isSent ? "justify-end" : "justify-start"}`}
      ref={menuRef}
    >
      <MessageBubbleFooterMeta
        createdAt={createdAt}
        isSent={isSent}
        readByRecipient={readByRecipient}
      />
      {isSent ? (
        <MessageBubbleFooterMenu
          messageId={messageId}
          conversationId={conversationId}
          menuOpen={menuOpen}
          onEdit={onEdit}
          onMenuToggle={onMenuToggle}
          setMenuOpen={setMenuOpen}
          threadCacheKey={threadCacheKey}
        />
      ) : null}
    </div>
  );
}
