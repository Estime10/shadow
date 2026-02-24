import { AppHeader } from "@/components/layout/AppHeader";
import { AppNav } from "@/components/layout/AppNav";
import { FeatureCard } from "@/components/home/FeatureCard";
import { MessageIcon } from "@/components/icons/MessageIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";

export const metadata = {
  title: "Accueil — Ghost Riders",
  description:
    "Messages éphémères 24h, calendrier partagé et notifications. App privée installable en PWA.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] pb-20 lg:h-screen lg:overflow-hidden">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 lg:min-h-0 lg:py-8">
        <section className="shrink-0 lg:mb-4">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--text)] md:text-3xl">
            What it do{" "}
            <span className="text-[var(--accent)]">( ghost )</span>
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
              description="Événements partagés, rappels et notifications. Tout reste dans l’app."
              icon={<CalendarIcon className="h-6 w-6" />}
            />
          </div>
        </section>
      </main>

      <AppNav />
    </div>
  );
}
