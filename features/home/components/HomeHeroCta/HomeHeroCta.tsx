import Link from "next/link";

const CTA_BASE =
  "flex flex-1 min-w-0 md:cursor-pointer items-center justify-center rounded-lg px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-white";

/**
 * Date + deux CTA (Contactez nous, Réservez un ticket). Date toujours au-dessus, boutons même largeur.
 */
export function HomeHeroCta() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-sm text-white/80 md:text-base">15 juin 2025</p>
      <div className="flex w-full max-w-sm gap-3 sm:max-w-md">
        <Link
          href="/messages"
          className={`${CTA_BASE} bg-white text-black md:hover:bg-white/90 focus-visible:ring-white`}
        >
          Contactez nous
        </Link>
        <Link
          href="/calendar"
          className={`${CTA_BASE} border-2 border-white text-white md:hover:bg-white/10 focus-visible:ring-white`}
        >
          Réservez un ticket
        </Link>
      </div>
    </div>
  );
}
