import { AppHeader } from "@/components/layout/AppHeader/AppHeader";
import { MessagesLayoutContent } from "./MessagesLayoutContent/MessagesLayoutContent";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function MessagesLayout({ children }: LayoutProps) {
  return <MessagesLayoutContent appHeader={<AppHeader />}>{children}</MessagesLayoutContent>;
}
