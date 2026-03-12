"use client";

import { useRef, useCallback } from "react";
import { useSWRConfig } from "swr";
import { createMessageAction } from "@/features/messages/actions";
import { MESSAGES_LIST_KEY } from "@/features/messages/constants";
import { messagesLogger } from "@/features/messages/lib/logger/logger";
import type { ThreadCacheKey } from "@/lib/hooks/messages";

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
      messagesLogger.submit("Envoi message", {
        conversationId: formData.get("conversationId"),
        hasMedia: !!formData.get("mediaPath"),
      });
      const { error } = await createMessageAction(formData);
      if (error) {
        messagesLogger.submit("Erreur envoi", error);
        return;
      }
      messagesLogger.submit("Message envoyé, invalidation cache");
      void mutate(MESSAGES_LIST_KEY);
      void mutate(threadCacheKey ?? ["thread", conversationId]);
      formRef.current?.reset();
    },
    [conversationId, threadCacheKey, mutate]
  );

  return { formRef, handleSubmit };
}
