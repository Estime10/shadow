import { notFound } from "next/navigation";
import { MessageIdHeader } from "@/features/messages/components/messageId/MessageIdHeader/MessageIdHeader";
import { MessageIdContent } from "@/features/messages/components/messageId/MessageIdContent/MessageIdContent";
import {
  getConversationById,
  getMessagesByConversationId,
} from "@/features/messages/data/fakeData";
import type { MessageIdPageContent } from "@/features/messages/types/content";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const conversation = getConversationById(id);
  return createPageMetadata({
    title: conversation ? `${conversation.participant.name} — Messages` : "Messages",
    description: "Messages éphémères 24h",
  });
}

export default async function MessageIdPage({ params }: PageProps) {
  const { id } = await params;
  const conversation = getConversationById(id);
  if (!conversation) notFound();

  const messages = getMessagesByConversationId(id);
  const content: MessageIdPageContent = { conversation, messages };

  return (
    <>
      <MessageIdHeader conversation={content.conversation} />
      <MessageIdContent {...content} />
    </>
  );
}
