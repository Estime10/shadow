"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { updateMessageAction } from "@/features/messages/actions";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageBubbleEditFormFields } from "./MessageBubbleEditFormFields/MessageBubbleEditFormFields";
import { MessageBubbleEditFormActions } from "./MessageBubbleEditFormActions/MessageBubbleEditFormActions";

const MESSAGES_LIST_KEY = "messages-list";

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
  const { mutate } = useSWRConfig();
  const [editText, setEditText] = useState(initialText);

  return (
    <div className="flex w-full justify-end">
      <form
        action={async (formData) => {
          const { error } = await updateMessageAction(formData);
          if (!error) {
            onCancel();
            void mutate(MESSAGES_LIST_KEY);
            void mutate(threadCacheKey ?? ["thread", conversationId]);
          }
        }}
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
