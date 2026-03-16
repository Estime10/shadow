import { createPageMetadata } from "@/lib/metadata/createPageMetadata";
import { HomeView } from "@/features/home";

export const metadata = createPageMetadata({
  title: "Événements à venir",
  description: "Découvrez nos prochains événements et réservez votre place.",
});

export default function HomePage() {
  return <HomeView />;
}
