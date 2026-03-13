"use client";

import { useState, useEffect, useRef } from "react";

const VIDEO_CANVAS_WIDTH = 320;
const VIDEO_CANVAS_HEIGHT = 180;

export type UseMediaThumbnailReturn = {
  thumbnailUrl: string | null;
  loading: boolean;
};

/**
 * Pour une image : object URL directe.
 * Pour une vidéo : première frame dessinée sur un canvas (data URL).
 */
export function useMediaThumbnail(file: File | null): UseMediaThumbnailReturn {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    if (!file) {
      setThumbnailUrl(null);
      setLoading(false);
      return;
    }

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      setLoading(false);
      return () => {
        cancelledRef.current = true;
        URL.revokeObjectURL(url);
      };
    }

    if (file.type.startsWith("video/")) {
      setLoading(true);
      setThumbnailUrl(null);
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "metadata";
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      const onSeeked = () => {
        if (cancelledRef.current) return;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = VIDEO_CANVAS_WIDTH;
          canvas.height = VIDEO_CANVAS_HEIGHT;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setLoading(false);
            return;
          }
          ctx.drawImage(video, 0, 0, VIDEO_CANVAS_WIDTH, VIDEO_CANVAS_HEIGHT);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          if (!cancelledRef.current) {
            setThumbnailUrl(dataUrl);
          }
        } finally {
          setLoading(false);
          URL.revokeObjectURL(url);
          video.removeAttribute("src");
          video.load();
        }
      };

      const onError = () => {
        if (!cancelledRef.current) setLoading(false);
        URL.revokeObjectURL(url);
      };

      video.addEventListener("seeked", onSeeked, { once: true });
      video.addEventListener("error", onError, { once: true });
      video.src = url;
      video.currentTime = 0.1;

      return () => {
        cancelledRef.current = true;
        video.removeEventListener("seeked", onSeeked);
        video.removeEventListener("error", onError);
        URL.revokeObjectURL(url);
        video.removeAttribute("src");
        video.load();
      };
    }

    setThumbnailUrl(null);
    setLoading(false);
    return undefined;
  }, [file]);

  return { thumbnailUrl, loading };
}
