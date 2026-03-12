"use client";

import { useRef, useCallback } from "react";
import { useClientUserId } from "@/lib/hooks/messages";
import { messagesLogger } from "@/features/messages/lib/logger/logger";
import { uploadMessageMediaToStorage } from "@/features/messages/lib/uploadMessageMediaToStorage/uploadMessageMediaToStorage";

export type UseAttachMediaParams = {
  conversationId: string;
  onSubmitWithMedia: (formData: FormData) => Promise<void>;
};

export type UseAttachMediaReturn = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAttachClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};

/**
 * Logique métier : sélection fichier → upload Storage → envoi message avec média.
 * Le composant UI ne fait qu'afficher l'input file et appeler ces callbacks.
 */
export function useAttachMedia({
  conversationId,
  onSubmitWithMedia,
}: UseAttachMediaParams): UseAttachMediaReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = useClientUserId();

  const handleAttachClick = useCallback(() => {
    messagesLogger.media("Clic pièce jointe, ouverture sélecteur de fichier");
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      if (!userId) {
        messagesLogger.upload("Upload annulé : utilisateur non connecté");
        return;
      }
      messagesLogger.upload("Fichier sélectionné", file.name, file.type, file.size);

      const result = await uploadMessageMediaToStorage(file, userId, "image");
      if (!result.success) {
        messagesLogger.upload("Échec upload", result.error);
        return;
      }

      const formData = new FormData();
      formData.set("conversationId", conversationId);
      formData.set("text", "");
      formData.set("mediaPath", result.path);
      formData.set("mediaType", result.type);
      messagesLogger.submit("Envoi message avec média", result.path);
      await onSubmitWithMedia(formData);
    },
    [conversationId, userId, onSubmitWithMedia]
  );

  return { fileInputRef, handleAttachClick, handleFileChange };
}
