"use client";

import { useState, useCallback } from "react";
import { deleteMessageAction } from "@/features/messages/actions";
import { useInvalidateMessagesCache } from "@/features/messages/lib/useInvalidateMessagesCache/useInvalidateMessagesCache";
import type { MessageIdPageContent } from "@/features/messages/types";
import type { ThreadCacheKey } from "@/lib/hooks/messages";

export type UseMessageBubbleMenuConfirmParams = {
  messageId: string;
  conversationId: string;
  onClose: () => void;
  threadCacheKey?: ThreadCacheKey;
};

export type UseMessageBubbleMenuConfirmReturn = {
  confirmDeleteOpen: boolean;
  setConfirmDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmDelete: () => Promise<void>;
};

export function useMessageBubbleMenuConfirm({
  messageId,
  conversationId,
  onClose,
  threadCacheKey,
}: UseMessageBubbleMenuConfirmParams): UseMessageBubbleMenuConfirmReturn {
  const invalidate = useInvalidateMessagesCache();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    const formData = new FormData();
    formData.set("messageId", messageId);
    formData.set("conversationId", conversationId);
    const { error } = await deleteMessageAction(formData);
    setConfirmDeleteOpen(false);
    onClose();
    if (!error) {
      invalidate({
        conversationId,
        threadCacheKey,
        threadUpdater: (current: unknown) =>
          (current as MessageIdPageContent | undefined)
            ? {
                ...(current as MessageIdPageContent),
                messages: (current as MessageIdPageContent).messages.filter(
                  (m) => m.id !== messageId
                ),
              }
            : undefined,
      });
    }
  }, [messageId, conversationId, onClose, threadCacheKey, invalidate]);

  return { confirmDeleteOpen, setConfirmDeleteOpen, handleConfirmDelete };
}
