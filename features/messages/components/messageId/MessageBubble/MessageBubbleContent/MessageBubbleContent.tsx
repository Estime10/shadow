"use client";

import { useState } from "react";
import { Image as ImageIcon, Video } from "lucide-react";
import type { MessageMediaType } from "@/types";
import { MESSAGE_TRUNCATE_THRESHOLD } from "@/features/messages/constants";

type MessageBubbleContentProps = {
  text: string;
  mediaUrl?: string | null;
  mediaType?: MessageMediaType | null;
  /** true si l'utilisateur a déjà ouvert le média → bouton désactivé. */
  mediaViewedByMe?: boolean;
  /** Clic sur l’indicateur média (icône + « Photo » / « Vidéo ») pour ouvrir la modale plein écran. */
  onMediaClick?: (storagePath: string, mediaType: MessageMediaType) => void;
};

export function MessageBubbleContent({
  text,
  mediaUrl = null,
  mediaType = null,
  mediaViewedByMe = false,
  onMediaClick,
}: MessageBubbleContentProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMedia = mediaUrl != null && mediaUrl !== "" && mediaType != null;
  const shouldTruncate = text.length > MESSAGE_TRUNCATE_THRESHOLD;
  const displayText =
    shouldTruncate && !expanded ? `${text.slice(0, MESSAGE_TRUNCATE_THRESHOLD).trim()}…` : text;

  const handleMediaClick = () => {
    if (hasMedia && !mediaViewedByMe && mediaUrl && mediaType && onMediaClick)
      onMediaClick(mediaUrl, mediaType);
  };

  return (
    <div className="min-w-0 break-words space-y-1.5">
      {hasMedia ? (
        <button
          type="button"
          onClick={handleMediaClick}
          disabled={mediaViewedByMe}
          className="flex w-fit items-center gap-2 rounded-md text-(--text-muted) transition-colors hover:bg-(--border)/30 hover:text-(--text) disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-(--text-muted) md:cursor-pointer"
          aria-label={mediaType === "image" ? "Voir la photo" : "Voir la vidéo"}
          aria-disabled={mediaViewedByMe}
        >
          {mediaType === "image" ? (
            <ImageIcon className="h-4 w-4 shrink-0" aria-hidden />
          ) : mediaType === "video" ? (
            <Video className="h-4 w-4 shrink-0" aria-hidden />
          ) : null}
          <span className="text-xs font-medium uppercase tracking-wider">
            {mediaType === "image" ? "Photo" : "Vidéo"}
          </span>
        </button>
      ) : null}
      {text.length > 0 ? (
        <>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayText}</p>
          {shouldTruncate ? (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 md:cursor-pointer text-[10px] font-medium text-accent md:hover:underline"
            >
              {expanded ? "Voir moins" : "Voir plus"}
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
