import { SectionWithTitle } from "@/components/layout/SectionWithTitle/SectionWithTitle";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Notifications",
  description: "Notifications en temps réel",
});

export default function NotificationsPage() {
  return (
    <SectionWithTitle title="Notifications">
      Badge et notifications realtime. (À brancher sur Supabase.)
    </SectionWithTitle>
  );
}
