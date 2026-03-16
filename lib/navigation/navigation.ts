import { Home, MessageCircle, Calendar } from "lucide-react";
import type { NavItem } from "@/types/navigation";

export const mainNavItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: Home, badge: null },
  { href: "/messages", label: "Messages", icon: MessageCircle, badge: null },
  { href: "/calendar", label: "Calendrier", icon: Calendar, badge: null },
];
