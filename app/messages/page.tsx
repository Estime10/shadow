import { MessagesHeader } from "@/features/messages/components/messages/MessagesHeader/MessagesHeader";
import { MessagesContent } from "@/features/messages/components/messages/MessagesContent/MessagesContent";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Messages",
  description: "Messages éphémères 24h",
});

export default function MessagesPage() {
  return (
    <>
      <MessagesHeader />
      <MessagesContent />
    </>
  );
}
