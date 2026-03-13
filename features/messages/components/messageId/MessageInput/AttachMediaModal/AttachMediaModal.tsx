"use client";

import { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal/Modal";
import { useClientUserId } from "@/lib/hooks/messages";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";
import { messagesLogger } from "@/features/messages/lib/logger/logger";
import { uploadMessageMediaToStorage } from "@/features/messages/lib/uploadMessageMediaToStorage/uploadMessageMediaToStorage";
import { useMediaThumbnail } from "./useMediaThumbnail/useMediaThumbnail";
import { getMediaTypeFromFile } from "./getMediaTypeFromFile";
import Image from "next/image";

export type AttachMediaModalProps = {
  open: boolean;
  onClose: () => void;
  file: File | null;
  conversationId: string;
  onSubmitWithMedia: (formData: FormData) => Promise<void>;
};

export function AttachMediaModal({
  open,
  onClose,
  file,
  conversationId,
  onSubmitWithMedia,
}: AttachMediaModalProps) {
  const userId = useClientUserId();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { thumbnailUrl, loading } = useMediaThumbnail(file);

  const handleSend = useCallback(async () => {
    if (!file || !userId) return;
    const trimmed = text.trim();
    if (trimmed.length > MAX_MESSAGE_LENGTH) return;

    setSending(true);
    const mediaType = getMediaTypeFromFile(file);
    const result = await uploadMessageMediaToStorage(file, userId, mediaType);

    if (!result.success) {
      messagesLogger.upload("Échec upload depuis modale", result.error);
      setSending(false);
      return;
    }

    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("text", trimmed);
    formData.set("mediaPath", result.path);
    formData.set("mediaType", result.type);
    messagesLogger.submit("Envoi message avec média (modale)", result.path);
    await onSubmitWithMedia(formData);
    setSending(false);
    setText("");
    onClose();
  }, [file, userId, text, conversationId, onSubmitWithMedia, onClose]);

  const canSend = Boolean(file && userId && !sending);
  const showPreview = Boolean(file && (thumbnailUrl || loading));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Envoyer un média"
      titleId="attach-media-modal-title"
      subtitle={file ? file.name : undefined}
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 p-4">
        {showPreview && (
          <div className="relative flex min-h-[140px] w-full items-center justify-center overflow-hidden  aspect-video">
            {loading ? (
              <p className="text-sm text-(--text-muted)">Chargement de l’aperçu…</p>
            ) : thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                fill
                alt="Media"
                className="h-full w-full object-contain"
                priority
                sizes="100vw 100vh"
                unoptimized
              />
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="attach-media-caption" className="text-xs font-medium text-(--text-muted)">
            Légende (optionnel)
          </label>
          <textarea
            id="attach-media-caption"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajouter un message…"
            rows={2}
            maxLength={MAX_MESSAGE_LENGTH}
            className="min-h-[60px] w-full resize-none rounded-lg border-2 border-(--border) bg-(--bg) px-3 py-2 font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:border-accent focus:outline-none"
            aria-label="Légende du média"
            disabled={sending}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-(--bg) disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" aria-hidden />
            <span className="text-sm font-medium">{sending ? "Envoi…" : "Envoyer"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
