"use client";

import { useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { useMessageSubmit } from "../useMessageSubmit/useMessageSubmit";

type MessageInputFormProps = {
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageInputForm({ conversationId, threadCacheKey }: MessageInputFormProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { formRef, handleSubmit } = useMessageSubmit({
    conversationId,
    threadCacheKey,
  });

  const handleFocus = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex items-end gap-1.5  bg-(--bg) content-px py-1.5 focus-within:border-accent transition-colors"
    >
      <input type="hidden" name="conversationId" value={conversationId} />
      <textarea
        ref={inputRef}
        name="text"
        onFocus={handleFocus}
        placeholder="Écris un message…"
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        className="min-h-[28px] max-h-24 flex-1 resize-none bg-transparent font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none py-1"
        aria-label="Message"
        required
      />
      <button
        type="submit"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-(--bg)"
        aria-label="Envoyer"
      >
        <Send className="h-3.5 w-3.5" aria-hidden />
      </button>
    </form>
  );
}
