"use client";

import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? `password-${label.replace(/\s/g, "-").toLowerCase()}`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="font-display text-xs font-bold uppercase tracking-wider text-(--text-muted)"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full rounded-lg border-2 border-(--border) bg-surface content-px py-2.5 pr-11 text-(--text) placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent)/20 disabled:opacity-50 ${error ? "border-(--error) ring-2 ring-(--error)/30" : ""} ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-(--text-muted) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {visible ? (
              <EyeOff className="h-5 w-5" aria-hidden />
            ) : (
              <Eye className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-(--error)" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
