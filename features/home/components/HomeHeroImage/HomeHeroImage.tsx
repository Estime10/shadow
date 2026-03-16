import Image from "next/image";

const EVENT_IMAGE_SRC = "/images/concert.png";

/**
 * Image de fond hero : couvre toute la zone + overlay 35 %.
 */
export function HomeHeroImage() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={EVENT_IMAGE_SRC}
          alt=""
          fill
          className="object-cover object-center min-w-full min-h-full"
          priority
          sizes="100vw 100vh"
        />
      </div>
      <div className="absolute inset-0 bg-black/85" aria-hidden />
    </>
  );
}
