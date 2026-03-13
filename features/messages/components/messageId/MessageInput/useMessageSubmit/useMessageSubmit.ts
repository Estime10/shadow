"use client";

import { useRef, useCallback } from "react";
import { createMessageAction } from "@/features/messages/actions";
import { useInvalidateMessagesCache } from "@/features/messages/lib/useInvalidateMessagesCache/useInvalidateMessagesCache";
import { log } from "@/lib/logger/logger";
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
  const invalidate = useInvalidateMessagesCache();

  const submitWithFormData = useCallback(
    async (formData: FormData) => {
      log("messages-submit", "Envoi message", {
        conversationId: formData.get("conversationId"),
        hasMedia: !!formData.get("mediaPath"),
      });
      const { error } = await createMessageAction(formData);
      if (error) {
        log("messages-submit", "Erreur envoi", { error });
        return;
      }
      log("messages-submit", "Message envoyé, invalidation cache");
      invalidate({ conversationId, threadCacheKey });
    },
    [conversationId, threadCacheKey, invalidate]
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
