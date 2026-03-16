import { AppNav } from "@/components/layout/AppNav/AppNav";
import { HeaderMainLayout } from "@/components/layout/HeaderMainLayout/HeaderMainLayout";
import { NotificationsRoot } from "@/components/providers/NotificationsRoot/NotificationsRoot";
import { ToastRoot } from "@/components/providers/ToastRoot/ToastRoot";

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout (lowkey) : toasts, badges, header, zone principale, nav.
 * Toutes les routes sous (lowkey) ont la chrome app (sauf la home "/" qui est au-dessus).
 */
export default function LowkeyLayout({ children }: LayoutProps) {
  return (
    <ToastRoot>
      <NotificationsRoot>
        <HeaderMainLayout>{children}</HeaderMainLayout>
        <AppNav />
      </NotificationsRoot>
    </ToastRoot>
  );
}
