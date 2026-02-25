import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? `input-${label.replace(/\s/g, "-").toLowerCase()}`;
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="font-display text-xs font-bold uppercase tracking-wider text-(--text-muted)"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-lg border-2 border-(--border) bg-surface px-3 py-2.5 text-(--text) placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent)/20 disabled:opacity-50 ${error ? "border-(--error) ring-2 ring-(--error)/30" : ""} ${className}`}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-(--error)" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
