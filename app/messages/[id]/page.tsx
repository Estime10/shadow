import { notFound } from "next/navigation";
import { MessageIdHeader, MessageIdContent } from "@/features/messages/components";
import { getConversationWithMessages } from "@/features/messages/data";
import type { MessageIdPageContent } from "@/features/messages/types";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const data = await getConversationWithMessages(id);
  if (!data) {
    return createPageMetadata({ title: "Messages", description: "Messages éphémères 24h" });
  }
  return createPageMetadata({
    title: `${data.conversation.participant.name} — Messages`,
    description: "Messages éphémères 24h",
  });
}

export default async function MessageIdPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getConversationWithMessages(id);
  if (!data) notFound();

  const content: MessageIdPageContent = data;
  return (
    <>
      <MessageIdHeader conversation={content.conversation} />
      <MessageIdContent {...content} />
    </>
  );
}
