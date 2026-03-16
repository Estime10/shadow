"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MOBILE_BREAKPOINT_PX = 768;
const KEYBOARD_OPEN_DELAY_MS = 400;

const FORM_PAGES = ["/login", "/register"] as const;

function isFormPage(pathname: string): boolean {
  return (FORM_PAGES as readonly string[]).includes(pathname);
}

/**
 * Sur mobile : quand un input/textarea reçoit le focus dans une modale (role="dialog")
 * scroll pour le garder visible au-dessus du clavier (même logique que l’input message).
 */
export function ScrollInputIntoViewOnFocus() {
  const timerRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleFocusIn = (e: FocusEvent): void => {
      const target = e.target as Node;
      if (!(target instanceof HTMLElement)) return;
      const tagName = target.tagName.toLowerCase();
      const isField =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable;
      if (!isField) return;

      const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches;
      if (!isMobile) return;

      const inDialog = target.closest('[role="dialog"]');
      const onFormPage = pathname ? isFormPage(pathname) : false;
      if (!inDialog && !onFormPage) return;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, KEYBOARD_OPEN_DELAY_MS);
    };

    document.addEventListener("focusin", handleFocusIn as EventListener);
    return () => {
      document.removeEventListener("focusin", handleFocusIn as EventListener);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return null;
}
