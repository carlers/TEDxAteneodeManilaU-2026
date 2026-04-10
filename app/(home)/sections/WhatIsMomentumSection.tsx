export default function WhatIsMomentumSection() {
  return (
    <section id="what-is-momentum" className="relative w-full bg-black overflow-hidden">
      {/* Left atmospheric background — bleeds wider on mobile for immersion */}
      <div className="absolute inset-y-0 left-[-40%] sm:left-[-19%] w-[70%] sm:w-[45%] opacity-70 pointer-events-none">
        <img
          src="/momentum/bg-left.png"
          alt=""
          className="w-full h-full object-cover object-right"
        />
      </div>

      {/* Right atmospheric background — bleeds wider on mobile */}
      <div className="absolute top-[-5%] right-[-20%] sm:right-[-10%] w-[60%] sm:w-[42%] h-[110%] opacity-70 pointer-events-none">
        <img
          src="/momentum/bg-right.png"
          alt=""
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-black to-transparent" />
      </div>

      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-[80px] sm:h-[120px] pointer-events-none z-10 bg-gradient-to-b from-black to-transparent" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-[80px] sm:h-[120px] pointer-events-none z-10 bg-gradient-to-t from-black to-transparent" />

      {/* Main content */}
      <div className="relative z-10 py-14 sm:py-20 md:py-32 px-5 sm:px-6">
        <div className="mx-auto max-w-2xl flex flex-col gap-10 md:gap-16">
          {/* Heading */}
          <h2
            className="font-display text-white text-center leading-none tracking-[-0.04em] drop-shadow-[0px_4px_25px_rgba(0,0,0,0.35)]"
            style={{ fontSize: "clamp(3.2rem,10vw,8rem)" }}
          >
            WHAT IS <span className="text-tedx-red">MOMENTUM</span>?
          </h2>

          {/* Body copy */}
          <div className="font-sans text-[15px] sm:text-base text-white space-y-5 sm:space-y-6 leading-[23px] sm:leading-[25px]">
            <p>
              <strong className="text-tedx-red font-bold">Momentum is</strong>{" "}
              more than speed. It is the tension between stillness and motion, between holding on
              and letting go. It is the paradox that propels us forward: the more we strive, the
              more we risk emptiness; the more we stay content, the more we risk complacency.
            </p>
            <p>
              For this generation,{" "}
              <strong className="text-tedx-red font-bold">momentum is not</strong>{" "}
              inherited – it is created. Where older generations found momentum in stability and
              persistence, Gen Z discovers it in disruption, restlessness, and reinvention. We do
              not settle for linear paths; we carve infinite ones. And yet, this abundance of
              choice is both our freedom and our burden.
            </p>
            <p>
              <strong className="text-tedx-red font-bold">Momentum</strong>
              {", then, "}
              <strong className="text-tedx-red font-bold">is the</strong>{" "}
              mirror of our time: it reflects both possibility and limitation, both clouds and
              rain. It is not about choosing one side of the paradox but embracing the push and
              pull that keeps us alive, evolving, and in motion.
            </p>
            <p>
              TEDxAteneoDeManilaU invites you to experience momentum not as a passive talk, but
              as a lived encounter – with experiments, performances, and interactions that make
              paradox visible. Because{" "}
              <strong className="text-tedx-red font-bold">momentum is not</strong>{" "}
              just an idea to discuss. It is a force to feel.
            </p>
          </div>

          {/* Watch Trailer — inline on mobile */}
          <div className="flex justify-center md:hidden">
            <WatchTrailerButton />
          </div>
        </div>
      </div>

      {/* Watch Trailer — absolute on desktop, right of content */}
      <div className="hidden md:flex absolute right-[19%] top-1/3 z-20">
        <WatchTrailerButton />
      </div>
    </section>
  );
}

function WatchTrailerButton() {
  return (
    <a
      href="https://www.facebook.com/share/v/1HMZKBiTLg/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center hover:scale-105 transition-transform duration-300"
      style={{ transform: "rotate(10deg)" }}
      aria-label="Watch the Momentum trailer on Facebook"
    >
      <img
        src="/momentum/watch-trailer.svg"
        alt=""
        className="absolute inset-0 w-full h-full"
      />
      <span className="relative z-10 font-bold text-white text-center text-lg leading-tight uppercase">
        WATCH
        <br />
        TRAILER
      </span>
    </a>
  );
}
