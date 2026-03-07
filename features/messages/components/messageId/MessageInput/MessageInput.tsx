"use client";

import { useEffect } from "react";
import { useKeyboardHeight } from "@/lib/hooks/useKeyboardHeight/useKeyboardHeight";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageInputForm } from "./MessageInputForm/MessageInputForm";

type MessageInputProps = {
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
};

const KEYBOARD_HEIGHT_VAR = "--keyboard-height";

export function MessageInput({ conversationId, threadCacheKey }: MessageInputProps) {
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    document.documentElement.style.setProperty(KEYBOARD_HEIGHT_VAR, `${keyboardHeight}px`);
    return () => {
      document.documentElement.style.removeProperty(KEYBOARD_HEIGHT_VAR);
    };
  }, [keyboardHeight]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-(--bg) pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pb-[calc(env(safe-area-inset-bottom,0px)+var(--keyboard-height,0px))] transition-[bottom] duration-150 ease-out">
      <div className="bg-(--bg) content-px py-1.5">
        <MessageInputForm conversationId={conversationId} threadCacheKey={threadCacheKey} />
      </div>
    </div>
  );
}
