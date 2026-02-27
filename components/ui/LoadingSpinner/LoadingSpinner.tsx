"use client";

import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  /** Taille en pixels (côté du carré). */
  size?: number;
  /** Couleur via classe (ex. text-accent, text-(--text-muted)). */
  className?: string;
  /** Accessible label pour les lecteurs d'écran. */
  "aria-label"?: string;
};

/**
 * Spinner de chargement réutilisable (login, register, création conversation…).
 * Respecte prefers-reduced-motion : pas d’animation si l’utilisateur le demande.
 */
export function LoadingSpinner({
  size = 24,
  className = "text-accent",
  "aria-label": ariaLabel = "Chargement",
}: LoadingSpinnerProps) {
  return (
    <span className="inline-block" role="status" aria-label={ariaLabel}>
      <Loader2
        className={`animate-spin motion-reduce:animate-none ${className}`}
        size={size}
        strokeWidth={2.5}
        aria-hidden
      />
    </span>
  );
}
