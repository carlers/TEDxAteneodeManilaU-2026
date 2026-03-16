import Link from "next/link";

type InvolvementCard = {
  accent: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref?: string;
  ctaWidthClassName: string;
  isClosed?: boolean;
};

const involvementCards: InvolvementCard[] = [
  {
    accent: "Join",
    title: "our Core Team",
    description:
      "The heart of TEDxAteneodeManilaU is our passionate Core Team. We're seeking dedicated individuals who bring:",
    bullets: [
      "Creative energy and fresh perspectives",
      "Collaborative spirit and problem-solving skills",
      "Commitment to excellence in event execution",
      "Belief in the power of ideas to change lives",
    ],
    ctaLabel: "Applications Closed",
    ctaWidthClassName: "w-[218px]",
    isClosed: true,
  },
  {
    accent: "Sponsor",
    title: "our Vision",
    description:
      "As a sponsor, your organization becomes an essential partner in bringing these ideas to life. Your support enables us to:",
    bullets: [
      "Amplify diverse voices tackling today's most pressing challenges.",
      "Create exceptional experience for speakers and attendees",
      "Extend our reach beyond the event through digital platforms",
      "Build lasting connections within our LS community.",
    ],
    ctaLabel: "Apply Now",
    ctaHref: "/#sponsors",
    ctaWidthClassName: "w-[194px]",
  },
  {
    accent: "Share",
    title: "your Idea",
    description:
      "As a speaker, you become part of a platform dedicated to ideas worth spreading. You will have the opportunity to:",
    bullets: [
      "Present a compelling idea grounded in expertise",
      "Challenge perspectives and spark dialogue",
      "Inspire action within and beyond our LS community",
      "Contribute to a platform that amplifies diverse voices",
    ],
    ctaLabel: "Apply Now",
    ctaHref: "/#speakers",
    ctaWidthClassName: "w-[194px]",
  },
];

function InvolvementCta({
  href,
  isClosed,
  label,
  widthClassName,
}: {
  href?: string;
  isClosed?: boolean;
  label: string;
  widthClassName: string;
}) {
  const sharedClassName = `inline-flex h-[50px] ${widthClassName} items-center justify-center rounded-[5px] text-center text-[18px] font-bold leading-none transition-colors duration-200`;

  if (isClosed || !href) {
    return (
      <span
        aria-disabled="true"
        className={`${sharedClassName} cursor-not-allowed bg-tedx-disabled px-5 text-tedx-disabled-text`}
      >
        {label}
      </span>
    );
  }

  return (
    <Link
      className={`${sharedClassName} bg-tedx-accent px-5 text-tedx-white hover:bg-tedx-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-white focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black`}
      href={href}
    >
      {label}
    </Link>
  );
}

function InvolvementListItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-[7px]">
      <span
        aria-hidden="true"
        className="pt-[2px] text-[20px] font-bold leading-none text-tedx-accent"
      >
        x
      </span>
      <span className="text-[16px] leading-[25px] text-tedx-white">
        {children}
      </span>
    </li>
  );
}

export default function GetInvolvedSection() {
  return (
    <section
      id="get-involved"
      aria-labelledby="get-involved-heading"
      className="bg-tedx-black px-4 py-20 text-tedx-white sm:px-6 lg:px-0 lg:py-[88px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <h2
          id="get-involved-heading"
          className="font-league-gothic text-center text-[4.25rem] leading-[0.82] tracking-[-0.04em] text-tedx-white sm:text-[5.5rem] lg:text-[128px] lg:leading-none lg:tracking-[-0.04em]"
        >
          <span className="block sm:inline">HOW TO BE </span>
          <span className="text-tedx-accent">INVOLVED</span>
        </h2>

        <div className="mt-14 grid w-full max-w-[1398px] gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-[100px] lg:grid-cols-3 lg:gap-x-[32px] lg:gap-y-[36px]">
          {involvementCards.map((card) => (
            <article
              key={card.title}
              className="mx-auto flex h-full w-full max-w-[475px] flex-col items-center lg:min-h-[471px]"
            >
              <div className="flex w-full flex-1 flex-col items-center">
                <h3 className="text-center text-[2.2rem] font-bold leading-[0.92] tracking-[-0.04em] text-tedx-white lg:text-[36px] lg:leading-none lg:tracking-[-1.44px]">
                  <span className="block text-tedx-accent">{card.accent}</span>
                  <span className="block">{card.title}</span>
                </h3>

                <div className="mt-8 w-full max-w-[358px] text-left lg:mt-[38px]">
                  <p className="text-[16px] leading-[25px] text-tedx-white">
                    {card.description}
                  </p>

                  <ul className="mt-5 space-y-[2px]">
                    {card.bullets.map((bullet) => (
                      <InvolvementListItem key={bullet}>{bullet}</InvolvementListItem>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 lg:mt-auto">
                <InvolvementCta
                  href={card.ctaHref}
                  isClosed={card.isClosed}
                  label={card.ctaLabel}
                  widthClassName={card.ctaWidthClassName}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
