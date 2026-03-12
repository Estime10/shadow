"use client";

import { formatEuropeanDateTime } from "@/lib/functions";

type MessageBubbleFooterMetaProps = {
  createdAt: string;
  isSent: boolean;
  readByRecipient: boolean;
};

export function MessageBubbleFooterMeta({
  createdAt,
  isSent,
  readByRecipient,
}: MessageBubbleFooterMetaProps) {
  return (
    <>
      <span className={`text-[10px] shrink-0 ${isSent ? "text-accent" : "text-(--text-muted)"}`}>
        {formatEuropeanDateTime(createdAt)}
      </span>
      {isSent && readByRecipient ? (
        <span
          className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-(--text-muted)"
          title="Lu"
        >
          Lu
        </span>
      ) : null}
    </>
  );
}
