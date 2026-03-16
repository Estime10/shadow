import { MessagesLayoutContent } from "./MessagesLayoutContent/MessagesLayoutContent";

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout messages sous (lowkey) : le header et le main viennent du layout (lowkey).
 * On ne rend que le contenu (transition + children).
 */
export default function MessagesLayout({ children }: LayoutProps) {
  return <MessagesLayoutContent>{children}</MessagesLayoutContent>;
}
