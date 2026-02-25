"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Retourne la hauteur du clavier virtuel (différence entre innerHeight et visualViewport.height).
 * Utile pour remonter un input fixe au-dessus du clavier sur mobile.
 */
export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const update = useCallback(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const offset = window.innerHeight - window.visualViewport.height;
    setKeyboardHeight(offset > 0 ? offset : 0);
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const id = requestAnimationFrame(() => update());
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);

    return () => {
      cancelAnimationFrame(id);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [update]);

  return keyboardHeight;
}
