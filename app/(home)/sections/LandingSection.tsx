import Image from "next/image";
import Link from "next/link";

const eventDetails = [
  { icon: "/landing/calendar.svg", text: "25 APRIL 2026" },
  { icon: "/landing/time.svg", text: "1:00 PM → 4:00 PM" },
  { icon: "/landing/location.svg", text: "UP Town Center Cinema 2" },
];

export default function LandingSection() {
  return (
    <section
      id="landing"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-black"
    >
      {/* ── Mobile (< md): refined hero layout ─────────────────────── */}
      <div className="relative flex h-full w-full flex-col md:hidden">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(80%_65%_at_50%_18%,rgba(255,255,255,0.05),transparent_72%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-56 bg-gradient-to-b from-black via-black/92 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-20%] top-[46%] z-0 h-[1px] bg-white/20"
        />

        <div className="relative z-10 flex min-h-[100dvh] flex-col px-5 pb-8 pt-24">
          <div className="flex flex-1 flex-col justify-center">
            <div className="landing-enter-title">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                Ideas Worth Spreading
              </p>
              <h1 className="font-display text-[clamp(4.8rem,21vw,7.4rem)] leading-[0.86] tracking-[-0.03em] text-white">
                MOMENTUM
              </h1>
              <p className="mt-3 max-w-none whitespace-nowrap text-[1.1rem] leading-tight text-white/85">
                Unlocking Paths, Inspiring Change
              </p>
            </div>

            <div className="mt-7 landing-enter-register">
              <Link
                href="/register"
                className="inline-flex h-[56px] w-full items-center justify-center rounded-xl border border-tedx-red bg-tedx-red px-5 text-[1rem] font-bold tracking-[0.14em] text-white transition-all duration-200 ease-out hover:bg-tedx-accent-hover active:translate-y-[1px]"
              >
                REGISTER NOW
              </Link>
            </div>

            <div className="mt-6 landing-enter-details">
              <div className="rounded-xl border border-white/15 bg-white/[0.02] px-4 py-4">
                <div className="space-y-2.5">
                  {eventDetails.map(({ icon, text }) => (
                    <p
                      key={text}
                      className="flex items-center gap-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-white/78"
                    >
                      <Image src={icon} alt="" width={16} height={16} className="shrink-0 opacity-72" />
                      {text.replace("→", "-")}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-end gap-2 pt-8 landing-enter-scroll">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/55">
              Scroll
            </span>
            <div className="landing-bounce">
              <Image src="/landing/arrow.svg" alt="" width={20} height={20} className="rotate-180 opacity-55" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop (md+): original layout, untouched ──────────────── */}
      <div className="relative hidden min-h-[100dvh] w-full flex-col items-center justify-center md:flex">
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
