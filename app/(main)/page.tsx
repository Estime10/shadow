import { FeatureCard } from "@/components/home/FeatureCard/FeatureCard";
import { MessageIcon } from "@/components/icons/MessageIcon/MessageIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon/CalendarIcon";
import { createPageMetadata } from "@/lib/metadata/createPageMetadata";
import { getCurrentUserProfile } from "@/lib/supabase/getCurrentUserProfile";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "Messages éphémères 24h, calendrier partagé et notifications. App privée installable en PWA.",
});

export default async function HomePage() {
  const profile = await getCurrentUserProfile();
  const displayName = profile?.username ?? "ghost";

  return (
    <>
      <section className="shrink-0 lg:mb-4">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-(--text) md:text-3xl">
          What it do <span className="text-accent">( {displayName} )</span>
        </h1>
      </section>

      <section className="mt-6 flex flex-1 flex-col gap-4 lg:mt-4 lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="lg:flex lg:min-w-0 lg:flex-1">
          <FeatureCard
            className="lg:h-full"
            href="/messages"
            title="Messages"
            description="Envoyer et recevoir des messages texte, images et vidéos. Expiration automatique après 24h."
            icon={<MessageIcon className="h-6 w-6" />}
          />
        </div>
        <div className="lg:flex lg:min-w-0 lg:flex-1">
          <FeatureCard
            className="lg:h-full"
            href="/calendar"
            title="Calendrier"
            description="Événements partagés, rappels et notifications. Tout reste dans l'app."
            icon={<CalendarIcon className="h-6 w-6" />}
          />
        </div>
      </section>
    </>
  );
}
