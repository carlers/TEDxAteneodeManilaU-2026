import Image from "next/image";

const eventDetails = [
  { icon: "/landing/calendar.svg", text: "26 FEBRUARY 2026" },
  { icon: "/landing/time.svg", text: "2:00PM → 7:00PM" },
  { icon: "/landing/location.svg", text: "Arete, ADMU" },
];

export default function LandingSection() {
  return (
    <section
      id="landing"
      className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Red trapezoid / perspective stage — wider on mobile so it bleeds off edges */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none left-[-10%] right-[-10%] sm:left-0 sm:right-0"
        style={{ top: "55%", height: "22%" }}
      >
        <img
          src="/landing/trapezoid.svg"
          alt=""
          className="w-full h-full object-fill"
        />
      </div>

      {/* MOMENTUM heading — big and dominant on all screens */}
      <h1
        className="relative z-20 font-display text-white text-center leading-none tracking-[-0.01em]"
        style={{
          marginTop: "5vh",
          fontSize: "clamp(5.5rem, 19.5vw, 24rem)",
        }}
      >
        MOMENTUM
      </h1>

      {/* Subtitle with gradient text */}
      <div className="relative z-20 text-center mt-1">
        <p
          className="font-sans bg-clip-text text-transparent bg-cover bg-center tracking-[-0.09em]"
          style={{
            fontSize: "clamp(1.4rem, 4.86vw, 70px)",
            backgroundImage: "url('/landing/subtitle-bg.png')",
          }}
        >
          Unlocking Paths, Inspiring Change
        </p>
      </div>

      {/* Event details — stacked on mobile, row on desktop */}
      <div className="relative z-20 mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 px-4">
        {eventDetails.map(({ icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-2 text-tedx-muted-text font-medium tracking-[-0.04em] text-sm sm:text-base"
          >
            <Image src={icon} alt="" width={18} height={18} className="shrink-0 sm:w-[23px] sm:h-[23px]" />
            {text}
          </span>
        ))}
      </div>

      {/* Arrow icon — bottom right */}
      <div className="absolute bottom-8 right-6 sm:bottom-10 sm:right-10 z-20 rotate-180">
        <Image src="/landing/arrow.svg" alt="" width={30} height={30} className="sm:w-[39px] sm:h-[39px]" />
      </div>
    </section>
  );
}
