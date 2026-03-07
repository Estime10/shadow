"use client";

import { MoreVertical } from "lucide-react";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageBubbleMenu } from "../../MessageBubbleMenu/MessageBubbleMenu";

type MessageBubbleFooterMenuProps = {
  messageId: string;
  conversationId: string;
  menuOpen: boolean;
  onEdit: () => void;
  onMenuToggle: () => void;
  setMenuOpen: (open: boolean) => void;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageBubbleFooterMenu({
  messageId,
  conversationId,
  menuOpen,
  onEdit,
  onMenuToggle,
  setMenuOpen,
  threadCacheKey,
}: MessageBubbleFooterMenuProps) {
  return (
    <>
      <button
        type="button"
        onClick={onMenuToggle}
        className="shrink-0 md:cursor-pointer rounded p-1 md:hover:bg-(--bg)/20"
        aria-label="Options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {menuOpen ? (
        <MessageBubbleMenu
          messageId={messageId}
          conversationId={conversationId}
          onEdit={onEdit}
          onClose={() => setMenuOpen(false)}
          threadCacheKey={threadCacheKey}
        />
      ) : null}
    </>
  );
}
