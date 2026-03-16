"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log en dev ou vers un service en prod si besoin
    if (process.env.NODE_ENV === "development") {
       
      console.error("Error boundary:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 content-px py-12">
      <h1 className="font-display text-lg font-bold uppercase tracking-wider text-(--text)">
        Une erreur est survenue
      </h1>
      <p className="max-w-md text-center text-sm text-(--text-muted)">
        {error.message || "Un problème inattendu s'est produit. Réessayez."}
      </p>
      <Button variant="primary" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
