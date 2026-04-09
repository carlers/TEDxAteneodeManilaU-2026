import Image from "next/image";

const TEAM_IMAGES = [
  "/team/landing/team-pic-1.webp",
  "/team/landing/team-pic-2.webp",
  "/team/landing/team-pic-3.webp",
  "/team/landing/team-pic-4.webp",
  "/team/landing/team-pic-5.webp",
  "/team/landing/team-pic-6.webp",
];

const DUPLICATE_TEAM_IMAGES = [...TEAM_IMAGES, ...TEAM_IMAGES];

type GalleryRowProps = {
  direction: "left" | "right";
  shadow?: boolean;
  className?: string;
};

function GalleryRow({ direction, shadow = false, className = "" }: GalleryRowProps) {
  const animationClass =
    direction === "left" ? "team-marquee-left" : "team-marquee-right";

  return (
    <div className={`team-marquee-viewport ${className}`}>
      <div className={`team-marquee-track ${animationClass}`}>
        {DUPLICATE_TEAM_IMAGES.map((image, index) => (
          <div
            key={`${shadow ? "shadow" : "image"}-${image}-${index}`}
            className="relative h-[140px] w-[220px] shrink-0 overflow-hidden bg-tedx-black sm:h-[170px] sm:w-[270px] lg:h-[270px] lg:w-[450px]"
          >
            {shadow ? null : (
              <Image
                src={image}
                alt={`TEDx team photo ${(index % TEAM_IMAGES.length) + 1}`}
                fill
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 270px, 220px"
                className="object-cover"
                priority={index < 4}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type GallerySetProps = {
  topDirection: "left" | "right";
  shadowDirection: "left" | "right";
};

function GallerySet({ topDirection, shadowDirection }: GallerySetProps) {
  return (
    <div className="relative pb-5 pt-1 sm:pb-6">
      <div className="absolute inset-x-0 top-4 z-0 sm:top-7">
        <GalleryRow direction={shadowDirection} shadow />
      </div>
      <div className="relative z-10">
        <GalleryRow direction={topDirection} />
      </div>
    </div>
  );
}

export default function LandingSection() {
  return (
    <section
      id="landing"
      className="w-full overflow-hidden bg-gradient-to-b from-tedx-accent-strong via-tedx-red to-tedx-accent-shadow pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-7 lg:px-12">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <h1 className="font-sans text-[44px] uppercase leading-[0.9] tracking-[-0.05em] text-tedx-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)] sm:text-[56px] lg:text-[76px]">
            Meet The
            <br />
            Core Team
            <br />
            Behind The Event
          </h1>
          <p className="max-w-[240px] justify-self-end text-right text-xs font-semibold tracking-[0.03em] text-tedx-white sm:text-sm">
            A Core Team mixed with TEDx enthusiasts, creative minds, and dedicated
            individuals.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-12 sm:mt-12 sm:space-y-14 lg:mt-14 lg:space-y-16">
        <div className="relative left-1/2 w-screen -translate-x-1/2 -rotate-[4deg]">
          <GallerySet topDirection="left" shadowDirection="right" />
        </div>

        <p className="mx-auto max-w-[520px] px-6 text-center text-xs font-semibold tracking-[0.03em] text-tedx-white sm:text-sm">
          Through collaborative brainstorming and creative problem-solving, we
          craft an event that challenges perspectives and inspires action.
        </p>

        <div className="relative left-1/2 w-screen -translate-x-1/2 rotate-[4deg]">
          <GallerySet topDirection="right" shadowDirection="left" />
        </div>
      </div>
    </section>
  );
}
