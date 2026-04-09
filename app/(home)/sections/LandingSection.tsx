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
      {/* Red trapezoid / perspective stage */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: "57%", height: "19.5%" }}
      >
        <img
          src="/landing/trapezoid.svg"
          alt=""
          className="w-full h-full object-fill"
        />
      </div>

      {/* MOMENTUM heading */}
      <h1
        className="relative z-20 font-display text-white text-center leading-none tracking-[-0.01em]"
        style={{
          marginTop: "15vh",
          fontSize: "clamp(5rem, 19.5vw, 24rem)",
        }}
      >
        MOMENTUM
      </h1>

      {/* Subtitle with gradient text */}
      <div className="relative z-20 text-center">
        <p
          className="font-sans bg-clip-text text-transparent bg-cover bg-center tracking-[-0.09em]"
          style={{
            fontSize: "clamp(1.5rem, 4.86vw, 70px)",
            backgroundImage: "url('/landing/subtitle-bg.png')",
          }}
        >
          Unlocking Paths, Inspiring Change
        </p>
      </div>

      {/* Event details row */}
      <div className="relative z-20 mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-4">
        {eventDetails.map(({ icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-2 text-tedx-muted-text font-medium tracking-[-0.09em]"
            style={{ fontSize: "clamp(0.75rem, 1.46vw, 21px)" }}
          >
            <Image src={icon} alt="" width={23} height={23} className="shrink-0" />
            {text}
          </span>
        ))}
      </div>

      {/* Arrow icon — bottom right */}
      <div className="absolute bottom-10 right-10 z-20 rotate-180">
        <Image src="/landing/arrow.svg" alt="" width={39} height={39} />
      </div>
    </section>
  );
}
