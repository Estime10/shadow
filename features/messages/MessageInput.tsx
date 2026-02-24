"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const NAV_BOTTOM_REM = 5; // pb-20 = 5rem (hauteur AppNav)
const NAV_BOTTOM_PX = NAV_BOTTOM_REM * 16;

export function MessageInput() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateKeyboardHeight = useCallback(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const offset = window.innerHeight - window.visualViewport.height;
    setKeyboardHeight(offset > 0 ? offset : 0);
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const id = requestAnimationFrame(() => updateKeyboardHeight());
    vv.addEventListener("resize", updateKeyboardHeight);
    vv.addEventListener("scroll", updateKeyboardHeight);

    return () => {
      cancelAnimationFrame(id);
      vv.removeEventListener("resize", updateKeyboardHeight);
      vv.removeEventListener("scroll", updateKeyboardHeight);
    };
  }, [updateKeyboardHeight]);

  const handleFocus = useCallback(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    requestAnimationFrame(() => {
      updateKeyboardHeight();
      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, [updateKeyboardHeight]);

  return (
    <div
      className="fixed left-0 right-0 z-20 border-t-2 border-[var(--border)] bg-[var(--surface)] transition-[bottom] duration-150 ease-out"
      style={{
        bottom: `calc(${NAV_BOTTOM_PX + keyboardHeight}px + env(safe-area-inset-bottom, 0px))`,
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div className="safe-area-bottom px-4 py-3">
        <div className="flex items-end gap-2 rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] px-3 py-2 focus-within:border-[var(--accent)] transition-colors">
          <textarea
            ref={inputRef}
            onFocus={handleFocus}
            placeholder="Écris un message…"
            rows={1}
            className="min-h-[40px] max-h-32 flex-1 resize-none bg-transparent font-display text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
            aria-label="Message"
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] transition-opacity hover:opacity-90"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
