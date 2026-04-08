import Link from "next/link";

type OrganizerLink = {
  label: string;
  href: string;
};

type OrganizerProfile = {
  firstName: string;
  fullName: string;
  role: string;
  bio: string;
  avatarSrc?: string;
  links: OrganizerLink[];
};

const organizer: OrganizerProfile = {
  firstName: "Prof.",
  fullName: "Prof. Xavier Alpasa",
  role: "ADMU Faculty Staff",
  bio: "Prof. X (Xavier Alpasa) is a TED Fellow, entrepreneur, and innovation coach dedicated to driving social impact and transformative change. Through his work in leadership and social enterprise, he empowers communities and organizations to turn purpose into action.",
  links: [
    { label: "LinkedIn", href: "https://ph.linkedin.com/in/xavieralpasa" },
    { label: "Rags2riches", href: "https://www.ncronline.org/blogs/earthbeat/eco-catholic/literal-rags-riches-story-and-hope-environment" },
    { label: "Xavier and Associates", href: "https://xaa.ph" },
  ],
};

export default function OrganizerSection() {
  return (
    <section
      id="organizer"
      aria-labelledby="organizer-heading"
      className="w-full bg-tedx-black px-4 py-16 text-tedx-white sm:px-6 lg:px-0 lg:py-[88px]"
    >
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="mx-auto max-w-[780px] text-center">
          <h2
            id="organizer-heading"
            className="font-league-gothic tedx-section-heading-shadow text-[4.1rem] leading-[0.82] tracking-[-0.03em] text-tedx-white sm:text-[5.5rem] lg:text-[122px] lg:leading-none"
          >
            THE ORGANIZER
          </h2>
          <p className="mx-auto mt-5 max-w-[570px] text-[18px] leading-[1.25] text-tedx-muted-text">
            Meet the organizer guiding TEDxAteneodeManilaU 2026 with a focus on
            innovation, purpose-driven leadership, and ideas that inspire
            meaningful action across communities.
          </p>
        </div>

        <article className="mt-14 overflow-hidden rounded-[18px] bg-tedx-white/10 px-5 py-8 shadow-[0_22px_46px_rgba(0,0,0,0.35)] sm:px-8 lg:mt-[72px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,460px)] lg:items-center lg:gap-8 lg:px-14 lg:py-14">
          <div>
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-1 h-[85px] w-[6px] bg-tedx-red"
              />
              <div>
                <h3 className="text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem] lg:text-[58px]">
                  <span className="text-tedx-red">{organizer.firstName} </span>
                  <span>{organizer.fullName.replace(`${organizer.firstName} `, "")}</span>
                </h3>
                <p className="mt-2 text-[22px] font-medium leading-none text-tedx-muted-text">
                  {organizer.role}
                </p>
              </div>
            </div>

            <div className="mt-9 max-w-[680px]">
              <p className="text-[19px] leading-[1.28] text-tedx-white">
                {organizer.bio}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4 text-[22px] leading-none text-tedx-white">
              {organizer.links.map((item) => (
                <div key={item.label} className="flex items-center gap-5">
                  <span aria-hidden="true" className="h-[14px] w-[14px] rounded-full bg-tedx-white" />
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${item.label}`}
                    className="text-tedx-white transition-colors duration-200 hover:text-tedx-muted-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-white focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center lg:mt-0 lg:justify-end">
            <div
              aria-hidden="true"
              className="pointer-events-none relative h-[225px] w-[225px] sm:h-[275px] sm:w-[275px] lg:h-[345px] lg:w-[345px]"
            >
              <span
                className="absolute left-1/2 top-1/2 h-[27%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[6px]"
                style={{
                  backgroundImage: "var(--tedx-legacy-x-gradient)",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  filter:
                    "drop-shadow(0 0 24px var(--tedx-accent-glow-shadow-soft))",
                }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-[27%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[6px]"
                style={{
                  backgroundImage: "var(--tedx-legacy-x-gradient)",
                  transform: "translate(-50%, -50%) rotate(-45deg)",
                  filter:
                    "drop-shadow(0 0 24px var(--tedx-accent-glow-shadow-soft))",
                }}
              />

            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
