"use client";

import { useState, useCallback } from "react";
import { log } from "@/lib/logger/logger";
import { useClientUserId } from "@/lib/hooks/messages";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";
import { uploadMessageMediaToStorage } from "@/features/messages/lib/uploadMessageMediaToStorage/uploadMessageMediaToStorage";
import { useMediaThumbnail } from "../useMediaThumbnail/useMediaThumbnail";
import { getMediaTypeFromFile } from "../getMediaTypeFromFile";

export type UseAttachMediaModalParams = {
  file: File | null;
  conversationId: string;
  onSubmitWithMedia: (formData: FormData) => Promise<void>;
  onClose: () => void;
};

export type UseAttachMediaModalReturn = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  sending: boolean;
  thumbnailUrl: string | null;
  loading: boolean;
  handleSend: () => Promise<void>;
  canSend: boolean;
  showPreview: boolean;
};

/**
 * Logique métier : upload Storage + construction FormData + envoi message avec média.
 * Le composant modal ne fait qu’afficher et appeler handleSend.
 */
export function useAttachMediaModal({
  file,
  conversationId,
  onSubmitWithMedia,
  onClose,
}: UseAttachMediaModalParams): UseAttachMediaModalReturn {
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
      log("messages-upload", "Échec upload depuis modale", { error: result.error });
      setSending(false);
      return;
    }

    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("text", trimmed);
    formData.set("mediaPath", result.path);
    formData.set("mediaType", result.type);
    log("messages-submit", "Envoi message avec média (modale)", { path: result.path });
    await onSubmitWithMedia(formData);
    setSending(false);
    setText("");
    onClose();
  }, [file, userId, text, conversationId, onSubmitWithMedia, onClose]);

  const canSend = Boolean(file && userId && !sending);
  const showPreview = Boolean(file && (thumbnailUrl || loading));

  return {
    text,
    setText,
    sending,
    thumbnailUrl,
    loading,
    handleSend,
    canSend,
    showPreview,
  };
}
