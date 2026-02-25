"use client";

import { useCallback, useRef } from "react";
import { Send } from "lucide-react";
import { NAV_BOTTOM_PX } from "@/lib/config/layout";
import { useKeyboardHeight } from "@/lib/hooks/useKeyboardHeight/useKeyboardHeight";

export function MessageInput() {
  const keyboardHeight = useKeyboardHeight();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  return (
    <div
      className="fixed left-0 right-0 z-20 border-t-2 border-(--border) bg-surface transition-[bottom] duration-150 ease-out"
      style={{
        bottom: `calc(${NAV_BOTTOM_PX + keyboardHeight}px + env(safe-area-inset-bottom, 0px))`,
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div className="safe-area-bottom px-4 py-3">
        <div className="flex items-end gap-2 rounded-xl border-2 border-(--border) bg-(--bg) px-3 py-2 focus-within:border-accent transition-colors">
          <textarea
            ref={inputRef}
            onFocus={handleFocus}
            placeholder="Écris un message…"
            rows={1}
            className="min-h-[40px] max-h-32 flex-1 resize-none bg-transparent font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none"
            aria-label="Message"
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-(--bg)"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
