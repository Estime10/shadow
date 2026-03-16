import { SWRConfig } from "swr";
import { AppNav } from "@/components/layout/AppNav/AppNav";
import { HeaderMainLayout } from "@/components/layout/HeaderMainLayout/HeaderMainLayout";
import { NotificationsRoot } from "@/components/providers/NotificationsRoot/NotificationsRoot";
import { RefreshSessionOnVisibility } from "@/components/providers/RefreshSessionOnVisibility/RefreshSessionOnVisibility";
import { ToastRoot } from "@/components/providers/ToastRoot/ToastRoot";

type LayoutProps = {
  children: React.ReactNode;
};

const swrConfig = {
  revalidateOnFocus: false,
};

/**
 * Layout (lowkey) : toasts, badges, header, zone principale, nav.
 * Revalidation au focus désactivée : on rafraîchit la session au retour sur l’onglet puis on revalide (évite "failed to fetch").
 */
export default function LowkeyLayout({ children }: LayoutProps) {
  return (
    <SWRConfig value={swrConfig}>
      <ToastRoot>
        <NotificationsRoot>
          <RefreshSessionOnVisibility />
          <HeaderMainLayout>{children}</HeaderMainLayout>
          <AppNav />
        </NotificationsRoot>
      </ToastRoot>
    </SWRConfig>
  );
}
