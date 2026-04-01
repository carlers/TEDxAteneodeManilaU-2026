"use client";

import Image from "next/image";

export default function AboutTedxAteneoSection() {
  return (
    <section id="about-tedxateneodemanilau" className="bg-tedx-black text-tedx-white">

      <div className="w-full">
        <Image
          src="/about/admu/tedx-stage.png"
          alt="TEDxAteneodeManilaU Stage"
          width={1920}
          height={600}
          className="w-full object-cover"
        />
      </div>

      <div
        className="relative w-full py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/about/admu/bg-triangles.png')" }}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-12 md:px-20">
          
          <a href="https://www.facebook.com/OfficialAMAPage/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-32 h-32 mb-8 shrink-0" >
            <Image
              src="/about/admu/ama-logo-def.png"
              alt="Ateneo Management Association"
              fill
              className="object-contain transition-opacity duration-200 group-hover:opacity-0"
            />
            <Image
              src="/about/admu/ama-logo-hvr.png"
              alt="Ateneo Management Association"
              fill
              className="scale-150 object-contain transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            />
          </a>

          <h2 className="font-sans font-bold text-[clamp(3rem,8vw,90px)] leading-none tracking-[-0.03em] mb-10">
            <span className="text-tedx-red">TEDx</span>
            <span className="text-tedx-white">AteneodeManilaU</span>
          </h2>

          <div className="max-w-[680px] space-y-6 text-[16px] leading-wide text-tedx-white">
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
    
    <div className="relative w-full h-[400px] overflow-hidden group cursor-pointer mt-12">
      <div className="absolute inset-0 bg-tedx-black" />
      <Image
        src="/about/admu/tedx-ct-pic.png"
        alt="TEDxADMU Team"
        fill
        className="
          scale-100 blur-sm brightness-50
          group-hover:scale-100 group-hover:blur-0 group-hover:brightness-100
          transition-all duration-700 ease-in-out
        "
      />
      <div
        className="
          absolute inset-0 flex items-center justify-center
          transition-all duration-700 ease-in-out
          group-hover:-translate-x-full group-hover:opacity-0
        "
      >
        <span
          className="
            font-league-gothic text-[clamp(5rem,18vw,280px)]
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