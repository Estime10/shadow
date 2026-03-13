"use client";

import { useCallback } from "react";
import { updateMessageAction } from "@/features/messages/actions";
import { useInvalidateMessagesCache } from "@/features/messages/lib/useInvalidateMessagesCache/useInvalidateMessagesCache";
import type { ThreadCacheKey } from "@/lib/hooks/messages";

export type UseMessageBubbleEditFormParams = {
  conversationId: string;
  onCancel: () => void;
  threadCacheKey?: ThreadCacheKey;
};

export type UseMessageBubbleEditFormReturn = {
  handleSubmit: (formData: FormData) => Promise<void>;
};

/**
 * Logique métier : soumission formulaire d'édition → updateMessageAction → invalidation cache → onCancel.
 */
export function useMessageBubbleEditForm({
  conversationId,
  onCancel,
  threadCacheKey,
}: UseMessageBubbleEditFormParams): UseMessageBubbleEditFormReturn {
  const invalidate = useInvalidateMessagesCache();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await updateMessageAction(formData);
      if (!error) {
        onCancel();
        invalidate({ conversationId, threadCacheKey });
      }
    },
    [conversationId, onCancel, threadCacheKey, invalidate]
  );

  return { handleSubmit };
}
