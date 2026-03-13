"use client";

import { useRef, useCallback } from "react";
import { messagesLogger } from "@/features/messages/lib/logger/logger";

export type UseAttachMediaParams = {
  onFileSelected: (file: File) => void;
};

export type UseAttachMediaReturn = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAttachClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Logique métier : sélection fichier → callback (ex. ouverture modale de composition).
 * L’upload et l’envoi sont gérés par la modale.
 */
export function useAttachMedia({ onFileSelected }: UseAttachMediaParams): UseAttachMediaReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = useCallback(() => {
    messagesLogger.media("Clic pièce jointe, ouverture sélecteur de fichier");
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      messagesLogger.media("Fichier sélectionné, ouverture modale", file.name, file.type);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return { fileInputRef, handleAttachClick, handleFileChange };
}
