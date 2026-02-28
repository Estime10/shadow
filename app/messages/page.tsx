import { MessagesView } from "@/features/messages/components";
import { getConversationsForList } from "@/features/messages/data";
import { getAllProfiles, getCurrentUserProfile } from "@/lib/supabase/CRUD";
import type { MessagesPageContent } from "@/features/messages/types";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Messages",
  description: "Messages éphémères 24h",
});

export default async function MessagesPage() {
  const [{ conversations, currentUserId }, profiles, profile] = await Promise.all([
    getConversationsForList(),
    getAllProfiles(),
    getCurrentUserProfile(),
  ]);
  const content: MessagesPageContent = {
    conversations,
    currentUserId,
    profiles,
    messageDisappearAfterMinutes: profile?.messageDisappearAfterMinutes ?? 30,
  };
  return <MessagesView {...content} />;
}
