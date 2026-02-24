import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppNav } from "@/components/layout/AppNav";
import {
  MessageThread,
  getConversationById,
  getMessagesByConversationId,
} from "@/features/messages";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const conversation = getConversationById(id);
  return {
    title: conversation
      ? `${conversation.participant.name} — Messages — Ghost Riders`
      : "Messages — Ghost Riders",
    description: "Messages éphémères 24h",
  };
}

export default async function MessageIdPage({ params }: Props) {
  const { id } = await params;
  const conversation = getConversationById(id);
  if (!conversation) notFound();

  const messages = getMessagesByConversationId(id);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] pb-20 lg:h-screen lg:overflow-hidden">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-0 lg:min-h-0 lg:px-0">
        <div className="flex shrink-0 items-center justify-between bg-[var(--surface)] px-4 py-3 lg:px-6">
          <Link
            href="/messages"
            className="flex items-center gap-2 text-[var(--accent)] transition-opacity hover:opacity-80"
            aria-label="Retour aux messages"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
            <span className="font-display text-xs font-bold uppercase tracking-wider">Retour</span>
          </Link>
          <h1 className="font-display text-xl font-bold uppercase tracking-wider text-[var(--text)]">
            {conversation.participant.name}
          </h1>
        </div>

        <div className="flex-1 min-h-0">
          <MessageThread conversation={conversation} messages={messages} showHeader={false} />
        </div>
      </main>

      <AppNav />
    </div>
  );
}
