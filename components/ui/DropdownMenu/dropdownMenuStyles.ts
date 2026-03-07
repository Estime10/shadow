/**
 * Styles partagés pour les menus dropdown (panel + items).
 * Une seule source de vérité pour le design system.
 */

export const dropdownPanelClass =
  "absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border-2 border-(--border) bg-(--surface) py-1 shadow-lg";

export const dropdownItemClass =
  "flex w-full md:cursor-pointer items-center gap-2 content-px py-2 text-left font-display text-sm text-(--text) md:hover:bg-(--bg)";

export const dropdownItemDangerClass =
  "flex w-full md:cursor-pointer items-center gap-2 content-px py-2 text-left font-display text-sm text-(--error) md:hover:bg-(--bg)";
