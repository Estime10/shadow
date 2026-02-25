import { MessagesView } from "@/features/messages/components/messages/MessagesView/MessagesView";
import { getConversationsForList } from "@/features/messages/data/getConversationsForList";
import { getAllProfiles } from "@/lib/supabase/CRUD";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Messages",
  description: "Messages éphémères 24h",
});

export default async function MessagesPage() {
  const [{ conversations, currentUserId }, profiles] = await Promise.all([
    getConversationsForList(),
    getAllProfiles(),
  ]);
  return (
    <MessagesView conversations={conversations} currentUserId={currentUserId} profiles={profiles} />
  );
}
