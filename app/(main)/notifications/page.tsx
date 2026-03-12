import { getNotificationsForCurrentUser, NotificationsView } from "@/features/notifications";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";

export const metadata = createPageMetadata({
  title: "Notifications",
  description: "Notifications en temps réel",
});

export default async function NotificationsPage() {
  const notifications = await getNotificationsForCurrentUser();
  return <NotificationsView notifications={notifications} />;
}
