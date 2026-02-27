"use client";

import { useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { ThreadCacheKey } from "@/features/messages/hooks";
import { formatRelativeTime } from "@/lib/functions";
import { MessageBubbleMenu } from "../MessageBubbleMenu/MessageBubbleMenu";

type MessageBubbleFooterProps = {
  createdAt: string;
  isSent: boolean;
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
  messageId,
  conversationId,
  menuOpen,
  onEdit,
  onMenuToggle,
  setMenuOpen,
  threadCacheKey,
}: MessageBubbleFooterProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen, setMenuOpen]);

  return (
    <div
      className={`mt-2 flex items-center gap-2 pt-1 ${isSent ? "justify-end" : "justify-start"}`}
      ref={menuRef}
    >
      <span className={`text-[10px] shrink-0 ${isSent ? "text-accent" : "text-(--text-muted)"}`}>
        {formatRelativeTime(createdAt)}
      </span>
      {isSent ? (
        <>
          <button
            type="button"
            onClick={onMenuToggle}
            className="shrink-0 rounded p-1 hover:bg-(--bg)/20"
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
      ) : null}
    </div>
  );
}
