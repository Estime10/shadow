"use client";

import { useRef, useCallback } from "react";
import { log } from "@/lib/logger/logger";

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
    log("messages-media", "Clic pièce jointe, ouverture sélecteur de fichier");
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      log("messages-media", "Fichier sélectionné, ouverture modale", {
        name: file.name,
        type: file.type,
      });
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return { fileInputRef, handleAttachClick, handleFileChange };
}
