import { notFound } from "next/navigation";
import { MessageIdHeader } from "@/features/messages/components/messageId/MessageIdHeader/MessageIdHeader";
import { MessageIdContent } from "@/features/messages/components/messageId/MessageIdContent/MessageIdContent";
import { getConversationWithMessages } from "@/features/messages/data/getConversationWithMessages";
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

  const { conversation, messages, currentUserId } = data;
  return (
    <>
      <MessageIdHeader conversation={conversation} />
      <MessageIdContent
        conversation={conversation}
        messages={messages}
        currentUserId={currentUserId}
      />
    </>
  );
}
