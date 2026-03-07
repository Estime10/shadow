"use client";

import { useState } from "react";
import { MESSAGE_TRUNCATE_THRESHOLD } from "@/features/messages/constants";

type MessageBubbleContentProps = {
  text: string;
};

export function MessageBubbleContent({ text }: MessageBubbleContentProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > MESSAGE_TRUNCATE_THRESHOLD;
  const displayText =
    shouldTruncate && !expanded ? `${text.slice(0, MESSAGE_TRUNCATE_THRESHOLD).trim()}…` : text;

  return (
    <div className="min-w-0 break-words">
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayText}</p>
      {shouldTruncate ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-[10px] font-medium text-accent hover:underline"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      ) : null}
    </div>
  );
}
