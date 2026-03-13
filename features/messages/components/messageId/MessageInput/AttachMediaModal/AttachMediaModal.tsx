"use client";

import { Send } from "lucide-react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal/Modal";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";
import { useAttachMediaModal } from "./useAttachMediaModal/useAttachMediaModal";

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
  const { text, setText, sending, thumbnailUrl, loading, handleSend, canSend, showPreview } =
    useAttachMediaModal({ file, conversationId, onSubmitWithMedia, onClose });

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
