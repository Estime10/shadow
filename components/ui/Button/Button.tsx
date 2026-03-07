import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--bg) transition-colors md:hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent",
  secondary:
    "bg-surface px-5 py-3 font-display font-semibold uppercase tracking-wider text-(--text) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  outline:
    "border-2 border-(--border) px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--text) transition-colors md:hover:bg-(--surface-hover) focus-visible:ring-2 focus-visible:ring-accent",
  ghost:
    "px-5 py-3 font-display font-semibold uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex md:cursor-pointer items-center justify-center rounded-lg text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}
