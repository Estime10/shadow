"use client";

import { useRef, useCallback } from "react";
import { useSWRConfig } from "swr";
import { createMessageAction } from "@/features/messages/actions";
import type { ThreadCacheKey } from "@/lib/hooks/messages";

const MESSAGES_LIST_KEY = "messages-list";

export type UseMessageSubmitParams = {
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
};

export type UseMessageSubmitReturn = {
  formRef: React.RefObject<HTMLFormElement | null>;
  handleSubmit: (formData: FormData) => Promise<void>;
};

export function useMessageSubmit({
  conversationId,
  threadCacheKey,
}: UseMessageSubmitParams): UseMessageSubmitReturn {
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate } = useSWRConfig();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await createMessageAction(formData);
      if (!error) {
        void mutate(MESSAGES_LIST_KEY);
        void mutate(threadCacheKey ?? ["thread", conversationId]);
        formRef.current?.reset();
      }
    },
    [conversationId, threadCacheKey, mutate]
  );

  return { formRef, handleSubmit };
}
