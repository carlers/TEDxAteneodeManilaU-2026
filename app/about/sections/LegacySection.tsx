type LegacyMetric = {
  accent: string;
  remainder: string;
  description: string;
};

type CornerBlur = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const legacyColumns: Array<{
  alignment: "left" | "right";
  metrics: LegacyMetric[];
}> = [
  {
    alignment: "left",
    metrics: [
      {
        accent: "Since ",
        remainder: "2013",
        description:
          'Founded in 2013. The first event, themed "?????," took place on April XX, 2012 at the ABC with XXX attendees.',
      },
      {
        accent: "60+ ",
        remainder: "Sponsors",
        description:
          "Backed by over XX community partners and sponsors, whose generous support helps us make all of this possible.",
      },
    ],
  },
  {
    alignment: "right",
    metrics: [
      {
        accent: "100+ ",
        remainder: "Speakers",
        description:
          "Featuring over XX (and counting) esteemed alumni speakers and performers, each contributing to the rich legacy of inspiring and thought-provoking presentations.",
      },
      {
        accent: "10,000+ ",
        remainder: "Students",
        description:
          "Supported by a team of over XXX dedicated Atenean students, whose passion and commitment bring our events to life and create an inspiring experience for all.",
      },
    ],
  },
];

const blurMasks: Record<CornerBlur, string> = {
  "top-left": "var(--tedx-legacy-mask-top-left)",
  "top-right": "var(--tedx-legacy-mask-top-right)",
  "bottom-left": "var(--tedx-legacy-mask-bottom-left)",
  "bottom-right": "var(--tedx-legacy-mask-bottom-right)",
};

const legacyXTextStyle = {
  backgroundImage: "var(--tedx-legacy-x-gradient)",
  backgroundClip: "text" as const,
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent",
  color: "transparent",
  fontFamily: "Inter, Helvetica, Arial, sans-serif",
  fontSize: "500px",
  fontStyle: "normal",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "364px",
};

const legacyXGlowStyle = {
  color: "var(--tedx-accent-color)",
  fontFamily: "Inter, Helvetica, Arial, sans-serif",
  fontSize: "500px",
  fontStyle: "normal",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "364px",
  filter: "blur(22px)",
  opacity: 0.88,
  textShadow:
    "0 0 24px var(--tedx-accent-glow-shadow), 0 0 44px var(--tedx-accent-glow-shadow-soft)",
};

function CornerX({
  wrapperClassName,
  rotationClassName,
  blurSide,
}: {
  wrapperClassName: string;
  rotationClassName: string;
  blurSide: CornerBlur;
}) {
  const blurMask = blurMasks[blurSide];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute h-[21rem] w-[20rem] sm:h-[26rem] sm:w-[25rem] lg:h-[494px] lg:w-[492px] ${wrapperClassName}`}
    >
      <div className={`relative h-full w-full ${rotationClassName}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="relative z-[1] block select-none text-center"
            style={legacyXTextStyle}
          >
            X
          </span>
        </div>
          <div
          className="absolute -inset-8"
            style={{
              WebkitMaskImage: blurMask,
              maskImage: blurMask,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          >
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="block scale-[1.02] select-none text-center"
              style={legacyXGlowStyle}
            >
              X
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LegacySection() {
  return (
    <section
      id="legacy"
      aria-labelledby="legacy-heading"
      className="relative z-20 isolate overflow-visible bg-tedx-black px-0 py-24 text-tedx-white sm:py-28 lg:min-h-[1130px] lg:py-[140px]"
    >
      <div className="pointer-events-none absolute inset-0 left-1/2 z-30 w-[1440px] max-w-none -translate-x-1/2">
        <CornerX
          wrapperClassName="left-[72px] top-[108px] -translate-x-1/2 -translate-y-1/2 lg:left-[98px] lg:top-[139px]"
          rotationClassName="rotate-[30deg]"
          blurSide="top-left"
        />
        <CornerX
          wrapperClassName="left-[1368px] top-[108px] -translate-x-1/2 -translate-y-1/2 lg:left-[1338px] lg:top-[139px]"
          rotationClassName="-rotate-[30deg]"
          blurSide="top-right"
        />
        <CornerX
          wrapperClassName="left-[72px] bottom-[108px] -translate-x-1/2 translate-y-1/2 lg:left-[98px] lg:bottom-[139px]"
          rotationClassName="-rotate-[30deg]"
          blurSide="bottom-left"
        />
        <CornerX
          wrapperClassName="left-[1368px] bottom-[108px] -translate-x-1/2 translate-y-1/2 lg:left-[1338px] lg:bottom-[139px]"
          rotationClassName="rotate-[30deg]"
          blurSide="bottom-right"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1038px] flex-col items-center px-6 sm:px-12 lg:px-0">
        <h2
          id="legacy-heading"
          className="text-center text-[3.5rem] font-bold leading-[0.95] tracking-[-0.04em] sm:text-[4.5rem] lg:text-[90px]"
        >
          <span className="text-tedx-white">Our </span>
          <span className="text-tedx-accent">Legacy</span>
        </h2>

        <div className="mt-16 grid w-full gap-14 lg:mt-[78px] lg:grid-cols-2 lg:gap-x-[72px]">
          {legacyColumns.map((column) => {
            const isRightAligned = column.alignment === "right";

            return (
              <div
                key={column.alignment}
                className={`flex flex-col gap-14 ${isRightAligned ? "lg:items-end lg:text-right" : ""} lg:gap-[60px]`}
              >
                {column.metrics.map((metric) => (
                  <article key={`${metric.accent}${metric.remainder}`} className="max-w-[466px]">
                    <h3 className="text-[2.4rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[2.8rem] lg:text-[48px]">
                      <span className="text-tedx-accent">{metric.accent}</span>
                      <span className="text-tedx-white">{metric.remainder}</span>
                    </h3>
                    <p className="mt-5 text-[15px] leading-[1.65] text-tedx-white sm:mt-6 sm:text-base lg:mt-[30px] lg:leading-[25px]">
                      {metric.description}
                    </p>
                  </article>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
