"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_MODAL } from "@/lib/config/animations";

export type UseModalEffectParams = {
  open: boolean;
  onClose: () => void;
};

export type UseModalEffectReturn = {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  handleOverlayClick: (e: React.MouseEvent) => void;
  duration: number;
};

export function useModalEffect({ open, onClose }: UseModalEffectParams): UseModalEffectReturn {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const reduced = useReducedMotion();
  const duration = reduced ? 0 : ANIMATION_DURATION_MODAL;

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("overflow-hidden");
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onCloseRef.current();
  }

  return { overlayRef, handleOverlayClick, duration };
}
