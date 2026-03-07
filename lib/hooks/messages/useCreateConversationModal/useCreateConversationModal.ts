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
 * Re-exécute l'effet uniquement quand modalOpen change (refs pour éviter re-renders).
 */
export function useCreateConversationModal({
  modalOpen,
  setModalOpen,
  setSearchQuery,
  searchInputRef,
}: UseCreateConversationModalParams): void {
  const setModalOpenRef = useRef(setModalOpen);
  const setSearchQueryRef = useRef(setSearchQuery);
  const searchInputRefRef = useRef(searchInputRef);
  useEffect(() => {
    setModalOpenRef.current = setModalOpen;
    setSearchQueryRef.current = setSearchQuery;
    searchInputRefRef.current = searchInputRef;
  }, [setModalOpen, setSearchQuery, searchInputRef]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpenRef.current(false);
    }
    if (modalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("overflow-hidden");
      setSearchQueryRef.current("");
      requestAnimationFrame(() => searchInputRefRef.current.current?.focus());
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("overflow-hidden");
    };
  }, [modalOpen]);
}
