"use client";

import Image from "next/image";

export default function AboutTedxAteneoSection() {
  return (
    <section id="about-tedxateneodemanilau" className="bg-tedx-black text-tedx-white">

      <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[1440/633]">
        <Image
          src="/about/admu/tedx-stage.png"
          alt="TEDxAteneodeManilaU Stage"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        className="relative w-full py-16 sm:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/about/admu/bg-triangles.png')" }}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-20">

          <a href="https://www.facebook.com/OfficialAMAPage/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mb-8 h-20 w-20 shrink-0 sm:h-32 sm:w-32" >
            <Image
              src="/about/admu/ama-logo-def.png"
              alt="Ateneo Management Association"
              fill
              sizes="(min-width: 640px) 128px, 80px"
              className="object-contain transition-opacity duration-200 group-hover:opacity-0"
            />
            <Image
              src="/about/admu/ama-logo-hvr.png"
              alt="Ateneo Management Association"
              fill
              sizes="(min-width: 640px) 128px, 80px"
              className="scale-125 object-contain transition-opacity duration-200 opacity-0 group-hover:opacity-100 sm:scale-150"
            />
          </a>

          <h2 className="mb-10 font-sans font-bold text-[clamp(2.5rem,11vw,90px)] leading-none tracking-[-0.03em] sm:text-[clamp(3rem,8vw,90px)]">
            <span className="block text-tedx-red sm:inline">TEDx</span>
            <span className="block text-tedx-white sm:inline">AteneodeManilaU</span>
          </h2>

          <div className="max-w-[680px] space-y-6 text-[15px] leading-7 text-tedx-white sm:text-[16px] sm:leading-wide">
            <p>
              Since 2024,{" "}
              <span className="text-tedx-red font-bold">TEDxAteneoDeManilaU has been</span>{" "}
              under the Ateneo Management Association (AMA). The event continues to serve
              as a platform for innovative ideas, thought-provoking discussions, and
              inspiring stories from a diverse range of speakers.
            </p>
            <p>
              It brings together students, professionals, and changemakers who are
              passionate about driving positive impact in their communities. With each
              edition,{" "}
              <span className="text-tedx-red font-bold">TEDxAteneoDeManilaU fosters</span>{" "}
              meaningful conversations that challenge perspectives, ignite curiosity, and
              encourage action toward a better future.
            </p>
          </div>

        </div>
      </div>

      <div className="relative w-full h-[240px] overflow-hidden group cursor-pointer mt-8 sm:mt-12 sm:h-[320px] lg:h-[400px]">
        <div className="absolute inset-0 bg-tedx-black" />
        <Image
          src="/about/admu/tedx-ct-pic.png"
          alt="TEDxADMU Team"
          fill
          sizes="100vw"
          className="
          object-cover object-center
          scale-100 blur-sm brightness-50
          group-hover:scale-100 group-hover:blur-0 group-hover:brightness-100
          transition-all duration-700 ease-in-out
        "
        />
        <div
          className="
          absolute inset-0 flex items-center justify-center
          transition-all duration-700 ease-in-out
          lg:group-hover:-translate-x-full lg:group-hover:opacity-0
        "
        >
          <span
            className="
            font-league-gothic text-[clamp(3.25rem,16vw,280px)] sm:text-[clamp(4rem,18vw,280px)]
            leading-none tracking-[-0.03em] select-none
            text-tedx-white
          "
          >
            TED<span className="text-tedx-red">x</span>ADMU
          </span>
        </div>
      </div>

    </section>
  );
}