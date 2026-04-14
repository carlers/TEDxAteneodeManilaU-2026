import Reveal from "@/app/components/Reveal";
import NextImage from "next/image";

export default function SponsorsSection() {
  return (
    <section
      id="sponsors"
      className="w-full bg-black px-6 py-14 md:px-[120px] md:py-16"
    >
      <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center">
        <Reveal
          variant="fade-up"
          className="flex w-full flex-col items-center gap-4 text-center"
        >
          <h2
            className="font-display leading-none tracking-[-0.04em] text-white"
            style={{
              fontSize: "clamp(2.7rem, 7vw, 118px)",
              textShadow: "0 4px 25px rgba(0,0,0,.35)",
            }}
          >
            SPONSORS & PARTNERS
          </h2>
          <p className="max-w-[460px] text-[16px] text-tedx-muted-text">
            Learn more about our media partners and sponsors.
          </p>
        </Reveal>

        <Reveal
          variant="fade-up"
          delay={0.12}
          className="mt-8 w-full rounded-[36px] border-2 border-tedx-red md:mt-10"
        >
          <div className="flex w-full items-start justify-center px-6 py-14 md:px-12 md:py-16">
            <div className="grid w-full max-w-[550px] grid-cols-1 items-center justify-items-center gap-6 md:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)] md:gap-3 md:pt-4">
              <div className="flex w-full items-center justify-center md:justify-start">
                <div className="relative aspect-square w-60 max-w-[250px] md:max-w-[320px]">
                  <NextImage
                    src="/Megawide.png"
                    alt="Megawide Foundation"
                    fill
                    priority
                    unoptimized
                    className="object-contain object-center"
                  />
                </div>
              </div>

              <div className="flex w-full items-center justify-center md:justify-end">
                <div className="relative h-[206px] w-full max-w-[152px] md:h-[304px] md:max-w-[220px]">
                  <NextImage
                    src="/Absidy.png"
                    alt="Absidy"
                    fill
                    unoptimized
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
