/**
 * Titre et sous-titre du hero "Événements à venir".
 */
export function HomeHeroContent() {
  return (
    <div className="flex flex-col items-center">
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
  );
}
