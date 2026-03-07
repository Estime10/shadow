"use client";

import { forwardRef } from "react";
import { Search, X } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label": string;
  className?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { value, onChange, placeholder = "Rechercher…", "aria-label": ariaLabel, className = "" },
    ref
  ) => {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border-2 border-(--border) bg-(--bg) content-px py-2 ${className}`}
      >
        <Search className="h-4 w-4 shrink-0 text-(--text-muted)" aria-hidden />
        <input
          ref={ref}
          type="text"
          inputMode="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent font-display text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none"
          aria-label={ariaLabel}
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 rounded p-0.5 text-(--text-muted) transition-colors md:hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
