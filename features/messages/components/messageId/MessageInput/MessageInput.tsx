"use client";

import { useKeyboardHeight } from "@/lib/hooks/useKeyboardHeight/useKeyboardHeight";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageInputForm } from "./MessageInputForm/MessageInputForm";

type MessageInputProps = {
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageInput({ conversationId, threadCacheKey }: MessageInputProps) {
  const keyboardHeight = useKeyboardHeight();

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
        <MessageInputForm conversationId={conversationId} threadCacheKey={threadCacheKey} />
      </div>
    </div>
  );
}
