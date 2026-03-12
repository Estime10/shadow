"use client";

import { usePathname } from "next/navigation";
import { MessagesViewTransition } from "@/components/animations/MessagesViewTransition/MessagesViewTransition";
import { MESSAGES_PAGE_MAIN_CLASS } from "@/lib/config/pages";

type MessagesLayoutContentProps = {
  children: React.ReactNode;
  /** Rendu côté serveur, passé par le layout. */
  appHeader: React.ReactNode;
};

/**
 * Sur /messages : header app + main.
 * Sur /messages/[id] : pas de header app, uniquement le MessageIdHeader (retour + nom) dans le contenu.
 */
export function MessagesLayoutContent({ children, appHeader }: MessagesLayoutContentProps) {
  const pathname = usePathname();
  const isConversationPage = pathname !== "/messages" && pathname.startsWith("/messages/");

  if (isConversationPage) {
    return (
      <main className={`mx-auto flex w-full flex-1 flex-col ${MESSAGES_PAGE_MAIN_CLASS}`}>
        <MessagesViewTransition>{children}</MessagesViewTransition>
      </main>
    );
  }

  return (
    <>
      {appHeader}
      <main className={`mx-auto flex w-full flex-1 flex-col ${MESSAGES_PAGE_MAIN_CLASS}`}>
        <MessagesViewTransition>{children}</MessagesViewTransition>
      </main>
    </>
  );
}
