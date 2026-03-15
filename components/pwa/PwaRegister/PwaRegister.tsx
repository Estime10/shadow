"use client";

import { useEffect } from "react";

/**
 * Enregistre le Service Worker généré par next-pwa (sw.js).
 * Nécessaire avec l'App Router car next-pwa injecte le script dans l'entrée "main.js"
 * qui n'est pas utilisée telle quelle par Next.js 13+.
 * N'enregistre qu'en production (le SW n'est pas généré en dev).
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = (): void => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((registration) => {
          if (registration.waiting && navigator.serviceWorker.controller) {
            // Nouvelle version prête ; skipWaiting est géré par next-pwa
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        })
        .catch(() => {
          // sw.js absent (ex. dev) ou erreur — ignoré
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
