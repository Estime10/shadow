"use client";

import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { updateMessageAction } from "@/features/messages/actions";
import { MESSAGES_LIST_KEY } from "@/features/messages/constants";
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
  const { mutate } = useSWRConfig();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await updateMessageAction(formData);
      if (!error) {
        onCancel();
        void mutate(MESSAGES_LIST_KEY);
        void mutate(threadCacheKey ?? ["thread", conversationId]);
      }
    },
    [conversationId, onCancel, threadCacheKey, mutate]
  );

  return { handleSubmit };
}
