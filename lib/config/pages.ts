/**
 * Config des coques de page (main) pour éviter magic strings.
 * Même largeur max que header/nav (--content-max-w dans globals.css).
 */

/** Même espacement en haut que Messages (py-3) pour aligner barre + titre. */
export const MAIN_PAGE_MAIN_CLASS =
  "max-w-[var(--content-max-w)] content-px pt-3 pb-6 lg:min-h-0 lg:pt-3 lg:pb-8";

export const MESSAGES_PAGE_MAIN_CLASS = "max-w-[var(--content-max-w)] px-0 lg:min-h-0";
