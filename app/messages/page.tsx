import { MessagesView } from "@/features/messages/components";
import { getConversationsForList } from "@/features/messages/data";
import { getAllProfiles } from "@/lib/supabase/CRUD";
import type { MessagesPageContent } from "@/features/messages/types";
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
  const content: MessagesPageContent = { conversations, currentUserId, profiles };
  return <MessagesView {...content} />;
}
