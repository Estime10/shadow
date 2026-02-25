"use client";

import { MessageBubbleContent } from "./MessageBubbleContent";
import { MessageBubbleFooter } from "./MessageBubbleFooter";

type MessageBubbleViewProps = {
  text: string;
  createdAt: string;
  messageId: string;
  isSent: boolean;
  menuOpen: boolean;
  onEdit: () => void;
  onMenuToggle: () => void;
  setMenuOpen: (open: boolean) => void;
};

export function MessageBubbleView({
  text,
  createdAt,
  messageId,
  isSent,
  menuOpen,
  onEdit,
  onMenuToggle,
  setMenuOpen,
}: MessageBubbleViewProps) {
  return (
    <div
      className={`relative w-full max-w-[min(85%,20rem)] rounded-2xl px-4 py-2.5 min-w-0 ${
        isSent
          ? "rounded-br-md bg-(--accent)/15 text-(--text)"
          : "rounded-bl-md bg-surface text-(--text)"
      }`}
    >
      <MessageBubbleContent text={text} />
      <MessageBubbleFooter
        createdAt={createdAt}
        isSent={isSent}
        messageId={messageId}
        menuOpen={menuOpen}
        onEdit={onEdit}
        onMenuToggle={onMenuToggle}
        setMenuOpen={setMenuOpen}
      />
    </div>
  );
}
