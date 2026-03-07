"use client";

import { useState, useCallback } from "react";
import { useSWRConfig } from "swr";
import { deleteMessageAction } from "@/features/messages/actions";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import type { MessageIdPageContent } from "@/features/messages/types";

const MESSAGES_LIST_KEY = "messages-list";

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
  const { mutate } = useSWRConfig();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    const formData = new FormData();
    formData.set("messageId", messageId);
    formData.set("conversationId", conversationId);
    const { error } = await deleteMessageAction(formData);
    setConfirmDeleteOpen(false);
    onClose();
    if (!error) {
      void mutate(MESSAGES_LIST_KEY);
      const key = threadCacheKey ?? ["thread", conversationId];
      void mutate(
        key,
        (current: MessageIdPageContent | undefined) =>
          current
            ? { ...current, messages: current.messages.filter((m) => m.id !== messageId) }
            : undefined,
        { revalidate: true }
      );
    }
  }, [messageId, conversationId, onClose, threadCacheKey, mutate]);

  return { confirmDeleteOpen, setConfirmDeleteOpen, handleConfirmDelete };
}
