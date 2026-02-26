"use client";

import { useCallback, useRef } from "react";
import { Send } from "lucide-react";
import { useKeyboardHeight } from "@/lib/hooks/useKeyboardHeight/useKeyboardHeight";
import { createMessageAction } from "@/features/messages/actions";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

type MessageInputProps = {
  conversationId: string;
};

export function MessageInput({ conversationId }: MessageInputProps) {
  const keyboardHeight = useKeyboardHeight();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  return (
    <div
      className="fixed left-0 right-0 z-20 bg-(--bg) transition-[bottom] duration-150 ease-out"
      style={{
        bottom: 0,
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${keyboardHeight}px)`,
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div className="bg-(--bg) content-px py-1.5">
        <form
          action={async (formData) => {
            const result = await createMessageAction(formData);
            if (!result.error) {
              console.log("[messages] event envoi texte", {
                conversationId: formData.get("conversationId"),
              });
            }
          }}
          className="flex items-end gap-1.5 rounded-lg border-2 border-(--border) bg-(--bg) content-px py-1.5 focus-within:border-accent transition-colors"
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
      </div>
    </div>
  );
}
