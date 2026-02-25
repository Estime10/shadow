import { HeaderMainLayout } from "@/components/layout/HeaderMainLayout/HeaderMainLayout";
import { MessagesViewTransition } from "@/components/animations/MessagesViewTransition/MessagesViewTransition";
import { MESSAGES_PAGE_MAIN_CLASS } from "@/lib/config/pages";

type LayoutProps = {
  children: React.ReactNode;
};

export default function MessagesLayout({ children }: LayoutProps) {
  return (
    <HeaderMainLayout mainClassName={MESSAGES_PAGE_MAIN_CLASS}>
      <MessagesViewTransition>{children}</MessagesViewTransition>
    </HeaderMainLayout>
  );
}
