"use client";

import { useState } from "react";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageBubbleEditFormActions } from "./MessageBubbleEditFormActions/MessageBubbleEditFormActions";
import { MessageBubbleEditFormFields } from "./MessageBubbleEditFormFields/MessageBubbleEditFormFields";
import { useMessageBubbleEditForm } from "./useMessageBubbleEditForm/useMessageBubbleEditForm";

type MessageBubbleEditFormProps = {
  messageId: string;
  conversationId: string;
  initialText: string;
  onCancel: () => void;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageBubbleEditForm({
  messageId,
  conversationId,
  initialText,
  onCancel,
  threadCacheKey,
}: MessageBubbleEditFormProps) {
  const [editText, setEditText] = useState(initialText);
  const { handleSubmit } = useMessageBubbleEditForm({
    conversationId,
    onCancel,
    threadCacheKey,
  });

  return (
    <div className="flex w-full justify-end">
      <form
        action={handleSubmit}
        className="flex w-full max-w-[min(85%,20rem)] flex-col gap-2 rounded-2xl rounded-br-md bg-(--accent)/15 content-px py-2.5"
      >
        <input type="hidden" name="messageId" value={messageId} />
        <input type="hidden" name="conversationId" value={conversationId} />
        <MessageBubbleEditFormFields value={editText} onChange={setEditText} />
        <MessageBubbleEditFormActions onCancel={onCancel} />
      </form>
    </div>
  );
}
