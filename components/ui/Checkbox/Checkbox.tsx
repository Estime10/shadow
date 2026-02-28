"use client";

import { Check } from "lucide-react";

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  "aria-label": string;
  className?: string;
};

/**
 * Checkbox personnalisée (couleur accent, pas le bleu par défaut du navigateur).
 */
export function Checkbox({
  checked,
  onChange,
  "aria-label": ariaLabel,
  className = "",
}: CheckboxProps) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-2 border-(--border) bg-(--bg) transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 checked:border-accent checked:bg-accent"
      />
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100"
        aria-hidden
      >
        <Check className="h-3 w-3 stroke-3" />
      </span>
    </span>
  );
}
