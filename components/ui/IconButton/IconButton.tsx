"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonSize = "sm" | "md";
type IconButtonHover = "bg" | "surface";

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

const hoverClasses: Record<IconButtonHover, string> = {
  bg: "md:hover:bg-(--bg)",
  surface: "md:hover:bg-(--surface)",
};

const baseClass =
  "shrink-0 inline-flex md:cursor-pointer items-center justify-center rounded-full text-(--text-muted) transition-colors md:hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: IconButtonSize;
  hoverVariant?: IconButtonHover;
  "aria-label": string;
  children: ReactNode;
};

export function IconButton({
  size = "sm",
  hoverVariant = "bg",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${baseClass} ${sizeClasses[size]} ${hoverClasses[hoverVariant]} ${className}`.trim()}
      {...props}
    />
  );
}
