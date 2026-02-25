import { AppHeader } from "@/components/layout/AppHeader/AppHeader";
import { MAIN_PAGE_MAIN_CLASS } from "@/lib/config/pages";

export type HeaderMainLayoutProps = {
  children: React.ReactNode;
  /** Classes du <main> (optionnel). Défaut : config pages principale. */
  mainClassName?: string;
};

/**
 * Layout : en-tête (AppHeader) + zone de contenu principal (<main>).
 * Utilisé pour les pages qui ont la barre d’en-tête + contenu.
 */
export function HeaderMainLayout({ children, mainClassName }: HeaderMainLayoutProps) {
  return (
    <>
      <AppHeader />
      <main
        className={`mx-auto flex w-full flex-1 flex-col ${mainClassName ?? MAIN_PAGE_MAIN_CLASS}`}
      >
        {children}
      </main>
    </>
  );
}
