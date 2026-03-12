import { AppHeader } from "@/components/layout/AppHeader/AppHeader";
import { MainWithPathname } from "./MainWithPathname/MainWithPathname";

export type HeaderMainLayoutProps = {
  children: React.ReactNode;
  /** Classes du <main> pour les pages autres que la home (optionnel). */
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
      <MainWithPathname defaultMainClassName={mainClassName}>{children}</MainWithPathname>
    </>
  );
}
