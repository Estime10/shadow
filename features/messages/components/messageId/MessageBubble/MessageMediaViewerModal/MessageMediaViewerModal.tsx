"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { MessageMediaType } from "@/types";
import { ANIMATION_EASING } from "@/lib/config/animations";
import { useModalEffect } from "@/lib/hooks/useModalEffect/useModalEffect";
import { useSignedMediaUrl } from "./useSignedMediaUrl";
import Image from "next/image";

export type MessageMediaViewerModalProps = {
  open: boolean;
  onClose: () => void;
  storagePath: string | null;
  mediaType: MessageMediaType | null;
};

const DURATION = 0.2;

export function MessageMediaViewerModal({
  open,
  onClose,
  storagePath,
  mediaType,
}: MessageMediaViewerModalProps) {
  const { overlayRef, handleOverlayClick, duration } = useModalEffect({ open, onClose });
  const { url, loading, error } = useSignedMediaUrl(storagePath, open && Boolean(storagePath));

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Voir le média"
          className="fixed inset-0 z-[10001] flex h-dvh w-full flex-col bg-(--surface)/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration || DURATION, ease: ANIMATION_EASING }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative flex min-h-0 flex-1 items-center justify-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: duration || DURATION, ease: ANIMATION_EASING }}
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <p className="text-white/80">Chargement…</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : url && mediaType === "image" ? (
              <Image
                src={url}
                alt="Media"
                fill
                className="object-contain"
                priority
                sizes="100vw 100vh"
              />
            ) : url && mediaType === "video" ? (
              <video
                src={url}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-[99999] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
