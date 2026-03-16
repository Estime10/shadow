import type { ComponentType } from "react";

export type NavItem = {
  href: string;
  label: string;
  /** Composant icône Lucide (ex: Home, MessageCircle) pour le menu mobile. */
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  badge?: number | null;
};
