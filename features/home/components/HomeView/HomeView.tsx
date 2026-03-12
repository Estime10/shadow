import Image from "next/image";
import Link from "next/link";

const EVENT_IMAGE_SRC = "/images/event-party.jpg";

const ctaBase =
  "inline-flex md:cursor-pointer items-center justify-center rounded-lg px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-white";

/**
 * Hero plein écran "Événements à venir" : image de fond, overlay 35 %, titre, sous-titre, date, 2 CTA.
 * UI seule, pas de logique métier.
 */
export function HomeView() {
  return (
    <section
      className="relative left-1/2 flex-1 w-screen -translate-x-1/2 h-[calc(100dvh-3.5rem)] min-h-[calc(100dvh-3.5rem)] overflow-hidden top-6"
      aria-labelledby="event-title"
    >
      {/* Image de fond : couvre toute la zone, centrée, sans espace vide */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={EVENT_IMAGE_SRC}
          alt=""
          fill
          className="object-cover object-center min-w-full min-h-full "
          priority
          sizes="100vw 100vh"
        />
      </div>

      {/* Overlay 35 % */}
      <div className="absolute inset-0 bg-black/85" aria-hidden />

      {/* Contenu au-dessus de l'overlay */}
      <div className="relative z-10 flex min-h-full flex-col justify-between px-[var(--content-px)] py-8 lg:px-[var(--content-px-lg)] lg:py-10">
        <div>
          <h1
            id="event-title"
            className="font-display text-3xl font-bold uppercase tracking-wider text-white drop-shadow-md md:text-4xl lg:text-5xl"
          >
            Événements à venir
          </h1>
          <p className="mt-2 font-display text-lg uppercase tracking-wider text-white/90 md:text-xl">
            Ne manquez pas nos prochains rendez-vous
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-mono text-sm text-white/80 md:text-base">15 juin 2025</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/messages"
              className={`${ctaBase} bg-white text-black md:hover:bg-white/90 focus-visible:ring-white`}
            >
              Contactez nous
            </Link>
            <Link
              href="/calendar"
              className={`${ctaBase} border-2 border-white text-white md:hover:bg-white/10 focus-visible:ring-white`}
            >
              Réservez un ticket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
