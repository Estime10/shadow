import { HeaderMainLayout } from "@/components/layout/HeaderMainLayout/HeaderMainLayout";

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Factory : retourne un layout Next.js qui enveloppe les children avec HeaderMainLayout.
 * @param mainClassName - Classes du <main> (optionnel). Défaut : config pages principale.
 */
export function createHeaderMainLayout(mainClassName?: string) {
  return function MainLayout({ children }: LayoutProps) {
    return <HeaderMainLayout mainClassName={mainClassName}>{children}</HeaderMainLayout>;
  };
}
