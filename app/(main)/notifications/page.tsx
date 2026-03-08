import { NotificationsView, fakeNotifications } from "@/features/notifications";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Notifications",
  description: "Notifications en temps réel",
});

export default function NotificationsPage() {
  return <NotificationsView notifications={fakeNotifications} />;
}
