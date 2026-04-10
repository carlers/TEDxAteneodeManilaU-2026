import Image from "next/image";
import Link from "next/link";

const eventDetails = [
  { icon: "/landing/calendar.svg", text: "26 FEBRUARY 2026" },
  { icon: "/landing/time.svg", text: "2:00PM → 7:00PM" },
  { icon: "/landing/location.svg", text: "Arete, ADMU" },
];

export default function LandingSection() {
  return (
    <section
      id="landing"
      className="relative h-screen w-full bg-black overflow-hidden"
    >
      {/* ── Mobile (< md): clean poster layout ─────────────────────── */}
      <div className="md:hidden relative h-full w-full flex flex-col">

        {/* Brand mark — top-left */}
        <div className="absolute top-6 left-6 z-20 landing-enter-tedx">
          <p className="font-display text-white leading-none text-xl tracking-tight">
            TEDx<span className="text-tedx-red">AteneodeManilaU</span>
          </p>
        </div>

        {/* Diagonal red slash — graphic element behind MOMENTUM */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[-20%] z-0 pointer-events-none landing-enter-slash origin-center"
          style={{
            top: "42%",
            height: "28%",
            transform: "rotate(-12deg)",
            background: "#eb0028",
            boxShadow: "0 8px 60px rgba(235,0,40,0.35), 0 0 120px rgba(235,0,40,0.15)",
          }}
        />

        {/* Main poster content — pushed slightly above center */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6">

          {/* MOMENTUM wordmark */}
          <h1
            className="font-display text-white leading-none text-center landing-enter-title"
            style={{
              fontSize: "clamp(5.5rem, 23vw, 9rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            MOMENTUM
          </h1>

          {/* Subtitle — clean, left-aligned under the wordmark */}
          <div className="mt-8 w-full max-w-[320px] landing-enter-subtitle">
            <p
              className="font-sans text-white leading-tight"
              style={{ fontSize: "0.95rem", letterSpacing: "-0.01em" }}
            >
              Unlocking Paths,<br />
              Inspiring Change
            </p>
          </div>

          {/* Register button */}
          <div className="mt-6 w-full max-w-[320px] landing-enter-register">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-[50px] w-[194px] rounded-[5px] bg-tedx-red text-white font-bold text-[18px]
                         transition-all duration-150 ease-out
                         hover:brightness-110 hover:shadow-[0_8px_24px_rgba(235,0,40,0.4)]
                         active:brightness-90 active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(235,0,40,0.3)]"
            >
              REGISTER NOW
            </Link>
          </div>

          {/* Thin rule + event details */}
          <div className="mt-6 w-full max-w-[320px] landing-enter-details">
            <div
              aria-hidden="true"
              className="h-px w-10 bg-white/60 mb-3 landing-rule"
            />
            <div className="flex flex-col gap-1 text-tedx-muted-text font-sans uppercase"
                 style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}>
              <span>26 FEB 2026</span>
              <span>2:00 — 7:00 PM</span>
              <span>ARETE · ADMU</span>
            </div>
          </div>
        </div>

        {/* Scroll cue — bottom-right */}
        <div className="absolute bottom-8 right-6 z-20 flex flex-col items-end gap-2 landing-enter-scroll">
          <span className="font-sans text-white/60 uppercase"
                style={{ fontSize: "0.6rem", letterSpacing: "0.2em" }}>
            Scroll
          </span>
          <div className="landing-bounce">
            <Image src="/landing/arrow.svg" alt="" width={22} height={22} className="rotate-180 opacity-60" />
          </div>
        </div>
      </div>

      {/* ── Desktop (md+): original layout, untouched ──────────────── */}
      <div className="hidden md:flex relative h-full w-full flex-col items-center justify-center">
        {/* Red trapezoid / perspective stage */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none left-0 right-0"
          style={{ top: "55%", height: "22%" }}
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


        {/* Event details */}
        <div className="relative z-20 mt-6 flex flex-row items-center justify-center gap-8 px-4">
          {eventDetails.map(({ icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-2 text-tedx-muted-text font-medium tracking-[-0.04em] text-base"
            >
              <Image src={icon} alt="" width={23} height={23} className="shrink-0" />
              {text}
            </span>
          ))}
        </div>

        {/* Register button */}
        <div className="relative z-20 mt-8">
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-[50px] w-[194px] rounded-[5px] bg-tedx-red text-white font-bold text-[18px]
                       transition-all duration-150 ease-out
                       hover:brightness-110 hover:shadow-[0_8px_24px_rgba(235,0,40,0.4)]
                       active:brightness-90 active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(235,0,40,0.3)]"
          >
            REGISTER NOW
          </Link>
        </div>

        {/* Arrow icon — bottom right */}
        <div className="absolute bottom-10 right-10 z-20 rotate-180">
          <Image src="/landing/arrow.svg" alt="" width={39} height={39} />
        </div>
      </div>
    </section>
  );
}
