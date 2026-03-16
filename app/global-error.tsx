"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Boundary d'erreur racine : remplace le root layout (html/body).
 * Doit être auto-suffisant (pas de dépendance au layout ni aux providers).
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
       
      console.error("Global error boundary:", error);
    }
  }, [error]);

  return (
    <html lang="fr">
      <body
        className="antialiased min-h-screen flex flex-col items-center justify-center gap-6 p-6"
        style={{ backgroundColor: "#0a0a0a", color: "#fafafa" }}
      >
        <h1 className="text-xl font-bold uppercase tracking-wider">
          Une erreur critique est survenue
        </h1>
        <p className="max-w-md text-center text-sm opacity-80">
          {error.message || "Veuillez recharger la page ou réessayer plus tard."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-white/90 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
