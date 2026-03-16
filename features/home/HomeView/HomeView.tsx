import { HomeHeroImage } from "../components/HomeHeroImage/HomeHeroImage";
import { HomeHeroContent } from "../components/HomeHeroContent/HomeHeroContent";
import { HomeHeroCta } from "../components/HomeHeroCta/HomeHeroCta";

/**
 * Hero plein écran "Événements à venir" : image, overlay, titre, sous-titre, CTA.
 * Orchestrateur : compose image, content, cta.
 */
export function HomeView() {
  return (
    <section
      className="relative left-1/2 flex h-full min-h-full w-screen -translate-x-1/2 overflow-hidden"
      aria-labelledby="event-title"
    >
      <HomeHeroImage />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-(--content-px) py-8 lg:px-(--content-px-lg) lg:py-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <HomeHeroContent />
          <HomeHeroCta />
        </div>
      </div>
    </section>
  );
}
