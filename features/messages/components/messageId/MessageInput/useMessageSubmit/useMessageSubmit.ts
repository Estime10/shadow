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
  /** Soumission avec FormData construit à la main (ex. modale média). N’effectue pas de reset du formulaire. */
  submitWithFormData: (formData: FormData) => Promise<void>;
};

export function useMessageSubmit({
  conversationId,
  threadCacheKey,
}: UseMessageSubmitParams): UseMessageSubmitReturn {
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate } = useSWRConfig();

  const submitWithFormData = useCallback(
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
    },
    [conversationId, threadCacheKey, mutate]
  );

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      await submitWithFormData(formData);
      formRef.current?.reset();
    },
    [submitWithFormData]
  );

  return { formRef, handleSubmit, submitWithFormData };
}
