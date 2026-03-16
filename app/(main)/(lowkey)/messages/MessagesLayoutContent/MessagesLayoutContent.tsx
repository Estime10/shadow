"use client";

import { MessagesViewTransition } from "@/components/animations/MessagesViewTransition/MessagesViewTransition";
import { MESSAGES_PAGE_MAIN_CLASS } from "@/lib/config/pages";

type MessagesLayoutContentProps = {
  children: React.ReactNode;
  /** Rendu côté serveur. Si null, le layout parent fournit déjà le header ; on ne rend que le contenu. */
  appHeader?: React.ReactNode | null;
};

/**
 * Sous (lowkey) avec appHeader=null : rend uniquement le contenu (transition + children).
 * Le parent fournit header + main ; MainWithPathname applique MESSAGES_PAGE_MAIN_CLASS.
 */
export function MessagesLayoutContent({ children, appHeader }: MessagesLayoutContentProps) {
  const content = <MessagesViewTransition>{children}</MessagesViewTransition>;

  if (appHeader == null) {
    return content;
  }

  return (
    <>
      {appHeader}
      <main className={`mx-auto flex w-full flex-1 flex-col ${MESSAGES_PAGE_MAIN_CLASS}`}>
        {content}
      </main>
    </>
  );
}
