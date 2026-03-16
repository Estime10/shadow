import { notFound } from "next/navigation";
import { ThreadWithCache } from "@/features/messages/components";
import { getConversationWithMessages, getRoomConversation } from "@/features/messages/data";
import type { MessageIdPageContent } from "@/features/messages/types";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";
import { ROOM_CONVERSATION_ID } from "@/lib/supabase/constants";

/** Données initiales serveur ; cache SWR + Realtime pour mises à jour ciblées. */
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ with?: string }>;
};

async function getData(
  id: string,
  withUserId?: string | null
): Promise<MessageIdPageContent | null> {
  if (id === ROOM_CONVERSATION_ID) {
    return getRoomConversation(withUserId ?? null);
  }
  return getConversationWithMessages(id);
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const [{ id }, { with: withUserId }] = await Promise.all([params, searchParams]);
  const data = await getData(id, withUserId ?? null);
  if (!data) {
    return createPageMetadata({ title: "Messages", description: "Messages éphémères 24h" });
  }
  return createPageMetadata({
    title: `${data.conversation.participant.name} — Messages`,
    description: "Messages éphémères 24h",
  });
}

export default async function MessageIdPage({ params, searchParams }: PageProps) {
  const [{ id }, { with: withUserId }] = await Promise.all([params, searchParams]);
  const data = await getData(id, withUserId ?? null);
  if (!data) notFound();

  return <ThreadWithCache initial={data} conversationId={id} withUserId={withUserId ?? null} />;
}
