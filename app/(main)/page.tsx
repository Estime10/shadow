import { createPageMetadata } from "@/lib/metadata/createPageMetadata";
import { getCurrentUserProfile } from "@/lib/supabase/CRUD";
import { HomeView } from "@/features/home/components";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "Messages éphémères 24h, calendrier partagé et notifications. App privée installable en PWA.",
});

export default async function HomePage() {
  const profile = await getCurrentUserProfile();
  const displayName = profile?.username ?? "ghost";
  return <HomeView displayName={displayName} />;
}
