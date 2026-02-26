"use client";

import { useState } from "react";
import type { MessageBubbleProps } from "@/features/messages/types";
import { MessageBubbleEditForm } from "./MessageBubbleEditForm/MessageBubbleEditForm";
import { MessageBubbleView } from "./MessageBubbleView/MessageBubbleView";

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isSent = currentUserId != null && message.senderId === currentUserId;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setMenuOpen(false);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <MessageBubbleEditForm
        messageId={message.id}
        conversationId={message.conversationId}
        initialText={message.text}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`flex w-full ${isSent ? "justify-end" : "justify-start"}`}>
      <MessageBubbleView
        text={message.text}
        createdAt={message.createdAt}
        messageId={message.id}
        conversationId={message.conversationId}
        isSent={isSent}
        menuOpen={menuOpen}
        onEdit={handleEdit}
        onMenuToggle={() => setMenuOpen((o) => !o)}
        setMenuOpen={setMenuOpen}
      />
    </div>
  );
}
