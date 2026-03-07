"use client";

import { useEffect, useRef } from "react";

/**
 * Ferme (ex. menu) au clic en dehors de l'élément référencé.
 * Ne s'abonne que quand isActive est true. onClose passé par ref pour éviter
 * de ré-exécuter l'effet quand le parent fournit une nouvelle référence.
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void
): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isActive) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCloseRef.current();
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [isActive, ref]);
}
