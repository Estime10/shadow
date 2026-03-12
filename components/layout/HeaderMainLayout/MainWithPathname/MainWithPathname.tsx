"use client";

import { usePathname } from "next/navigation";
import { HOME_PAGE_MAIN_CLASS, MAIN_PAGE_MAIN_CLASS } from "@/lib/config/pages";

type MainWithPathnameProps = {
  children: React.ReactNode;
  /** Classe du main pour les pages autres que la home (optionnel). */
  defaultMainClassName?: string;
};

const BASE_MAIN_CLASS = "mx-auto flex w-full flex-1 flex-col";

/**
 * <main> avec classe dynamique selon la route : home = plein écran sans scroll, sinon défaut.
 */
export function MainWithPathname({ children, defaultMainClassName }: MainWithPathnameProps) {
  const pathname = usePathname();
  const mainClass =
    pathname === "/" ? HOME_PAGE_MAIN_CLASS : (defaultMainClassName ?? MAIN_PAGE_MAIN_CLASS);
  return <main className={`${BASE_MAIN_CLASS} ${mainClass}`}>{children}</main>;
}
