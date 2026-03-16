"use client";

import { usePathname } from "next/navigation";
import {
  HOME_PAGE_MAIN_CLASS,
  MAIN_PAGE_MAIN_CLASS,
  MESSAGES_PAGE_MAIN_CLASS,
} from "@/lib/config/pages";

type MainWithPathnameProps = {
  children: React.ReactNode;
  /** Classe du main pour les pages autres que la home (optionnel). */
  defaultMainClassName?: string;
};

const BASE_MAIN_CLASS = "mx-auto flex w-full flex-1 flex-col";

function getMainClass(pathname: string, defaultMainClassName?: string): string {
  if (pathname === "/") return HOME_PAGE_MAIN_CLASS;
  if (pathname.startsWith("/messages")) return MESSAGES_PAGE_MAIN_CLASS;
  return defaultMainClassName ?? MAIN_PAGE_MAIN_CLASS;
}

/**
 * <main> avec classe dynamique selon la route : home, messages, ou défaut.
 */
export function MainWithPathname({ children, defaultMainClassName }: MainWithPathnameProps) {
  const pathname = usePathname();
  const mainClass = getMainClass(pathname, defaultMainClassName);
  return <main className={`${BASE_MAIN_CLASS} ${mainClass}`}>{children}</main>;
}
