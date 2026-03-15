

export default function LandingSection() {
  return (
    <section
      id="landing"
      className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Trapezoid spotlight — top edge sits under MOMENTUM, fans to full width at bottom */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-10"
        style={{
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "120vw",
          height: "calc(50vh - 6.8vw)",
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          background:
            "linear-gradient(to bottom, rgba(210,0,25,0.95) 0%, rgba(235,0,40,0.80) 50%, transparent 100%)",
        }}
      />

      {/* MOMENTUM heading */}
      <div className="relative z-20 w-full text-center px-2 leading-none">
        <h1
          className="font-display text-white uppercase leading-none tracking-[-0.01em] w-full"
          style={{ fontSize: "clamp(5rem, 19.5vw, 24rem)" }}
        >
          MOMENTUM
        </h1>
      </div>

      {/* Subtitle + event details + CTA — pinned to bottom as one group */}
      <div className="absolute bottom-0 z-40 flex flex-col items-center gap-4 pb-14 text-center w-full px-4">
        <p
          className="font-sans text-tedx-red"
          style={{ fontSize: "clamp(1.25rem, 3.2vw, 2.75rem)" }}
        >
          Unlocking Paths, Inspiring Change
        </p>
        {/* Event details row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white font-bold uppercase tracking-widest text-xs sm:text-sm">
          {/* Date */}
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-tedx-red flex-shrink-0"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            26 February 2026
          </span>

          {/* Time */}
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-tedx-red flex-shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            2:00PM → 7:00PM
          </span>

          {/* Venue */}
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-tedx-red flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Arete, ADMU
          </span>
        </div>

        {/* Register CTA */}
        <a
          href="/register"
          className="mt-1 inline-block bg-tedx-red text-white font-bold uppercase tracking-widest text-sm px-12 rounded-md hover:bg-red-700 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tedx-red"
        >
          Register Now
        </a>
      </div>
    </section>
  );
}
