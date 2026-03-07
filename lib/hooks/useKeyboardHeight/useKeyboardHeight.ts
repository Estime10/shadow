"use client";

import { useSyncExternalStore } from "react";

function getKeyboardHeight(): number {
  if (typeof window === "undefined" || !window.visualViewport) return 0;
  const offset = window.innerHeight - window.visualViewport.height;
  return offset > 0 ? offset : 0;
}

function subscribeKeyboardHeight(callback: () => void): () => void {
  const vv = window.visualViewport;
  if (!vv) return () => {};
  const raf = requestAnimationFrame(callback);
  vv.addEventListener("resize", callback);
  vv.addEventListener("scroll", callback);
  return () => {
    cancelAnimationFrame(raf);
    vv.removeEventListener("resize", callback);
    vv.removeEventListener("scroll", callback);
  };
}

/**
 * Retourne la hauteur du clavier virtuel (différence entre innerHeight et visualViewport.height).
 * Utilise useSyncExternalStore pour un abonnement concurrent-safe (React 18+).
 */
export function useKeyboardHeight(): number {
  return useSyncExternalStore(subscribeKeyboardHeight, getKeyboardHeight, () => 0);
}
