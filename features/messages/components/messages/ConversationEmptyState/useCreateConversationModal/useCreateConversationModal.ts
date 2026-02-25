"use client";

import { useEffect, useRef } from "react";

type UseCreateConversationModalParams = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
};

/**
 * Gère escape, body scroll et focus pour la modale "Créer une conversation".
 */
export function useCreateConversationModal({
  modalOpen,
  setModalOpen,
  setSearchQuery,
  searchInputRef,
}: UseCreateConversationModalParams): void {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    if (modalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      setSearchQuery("");
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [modalOpen, setModalOpen, setSearchQuery, searchInputRef]);
}
