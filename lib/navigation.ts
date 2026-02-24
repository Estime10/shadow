import type { NavItem } from "@/types/navigation";

export const mainNavItems: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/messages", label: "Messages" },
  { href: "/calendar", label: "Calendrier" },
  { href: "/notifications", label: "Notifications", badge: null },
];
