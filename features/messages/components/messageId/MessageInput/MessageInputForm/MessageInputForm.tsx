"use client";

import { useRef, useCallback, useState } from "react";
import { Plus, Send } from "lucide-react";
import { ACCEPT_MEDIA, MAX_MESSAGE_LENGTH } from "@/features/messages/constants";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { useAttachMedia } from "../useAttachMedia/useAttachMedia";
import { useMessageSubmit } from "../useMessageSubmit/useMessageSubmit";
import { AttachMediaModal } from "../AttachMediaModal/AttachMediaModal";

type MessageInputFormProps = {
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageInputForm({ conversationId, threadCacheKey }: MessageInputFormProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { formRef, handleSubmit, submitWithFormData } = useMessageSubmit({
    conversationId,
    threadCacheKey,
  });
  const { fileInputRef, handleAttachClick, handleFileChange } = useAttachMedia({
    onFileSelected: useCallback((file: File) => {
      setSelectedFile(file);
      setModalOpen(true);
    }, []),
  });

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedFile(null);
  }, []);

  const handleFocus = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex items-end gap-1.5  bg-(--bg) content-px py-1.5 focus-within:border-accent transition-colors"
    >
      <input type="hidden" name="conversationId" value={conversationId} />
      <textarea
        ref={inputRef}
        name="text"
        onFocus={handleFocus}
        placeholder="Écris un message…"
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        className="min-h-[28px] max-h-24 flex-1 resize-none bg-transparent font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none py-1"
        aria-label="Message"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_MEDIA}
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
      <AttachMediaModal
        open={modalOpen}
        onClose={handleCloseModal}
        file={selectedFile}
        conversationId={conversationId}
        onSubmitWithMedia={submitWithFormData}
      />
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={handleAttachClick}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-(--bg) text-accent"
          aria-label="Joindre une image"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="submit"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-(--bg)"
          aria-label="Envoyer"
        >
          <Send className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </form>
  );
}
