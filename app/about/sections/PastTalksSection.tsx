"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type TalkCard = {
  category: string;
  title: string;
  speaker: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageAspectClassName: string;
  imagePosition?: string;
};

const talks: TalkCard[] = [
  {
    category: "Gen Z Culture",
    title: "How Gen Z's 'delulu' culture impacts their reality",
    speaker: "Justine Danielle Reyes",
    href: "https://youtu.be/XcTLzueNk4c",
    imageSrc: "/about/past-talks/gen-z-culture.jpg",
    imageAlt: "Justine Danielle Reyes speaking on the TEDxAteneodeManilaU stage.",
    imageAspectClassName: "aspect-[392/245]",
  },
  {
    category: "Politics & Homosexuality",
    title: "Why can't we have a gay president?",
    speaker: "Boy Abunda",
    href: "https://youtu.be/bhRooc33szU?list=PLwi8znzPhFSNwE_3utK4O4Hp5V0Cb9jfn",
    imageSrc: "/about/past-talks/politics-homosexuality.jpg",
    imageAlt: "Boy Abunda speaking into a microphone during his TEDx talk.",
    imageAspectClassName: "aspect-[392/245]",
  },
  {
    category: "Language & Communication",
    title: "Pitch Perfect: How Tone Bridges Barriers",
    speaker: "Inka Magnaye",
    href: "https://youtu.be/-KNN4zETSjE",
    imageSrc: "/about/past-talks/language-communication.jpg",
    imageAlt: "Inka Magnaye presenting on stage in front of TEDx letters.",
    imageAspectClassName: "aspect-[392/245]",
  },
  {
    category: "Awareness & Humanitarianism",
    title: "Is rape culture the new social cancer?",
    speaker: "Kat Alaano",
    href: "https://youtu.be/CDCPJwwAYRE?list=PLwi8znzPhFSNwE_3utK4O4Hp5V0Cb9jfn",
    imageSrc: "/about/past-talks/awareness-humanitarianism.jpg",
    imageAlt: "Kat Alaano speaking on stage with instruments in the background.",
    imageAspectClassName: "aspect-[392/245]",
    imagePosition: "100% 54%",
  },
  {
    category: "Filipino Resilience",
    title: "Fostering growth by compounding resilience",
    speaker: "Lyqa Maravilla",
    href: "https://youtu.be/pQBawObMFOY",
    imageSrc: "/about/past-talks/filipino-resilience.jpg",
    imageAlt: "Lyqa Maravilla speaking under a spotlight during her talk.",
    imageAspectClassName: "aspect-[392/245]",
  },
  {
    category: "Mental Health",
    title: "My quest for I",
    speaker: "Jetro Rafael",
    href: "https://youtu.be/UgQko2-nlwk?list=PLwi8znzPhFSNwE_3utK4O4Hp5V0Cb9jfn",
    imageSrc: "/about/past-talks/mental-health.jpg",
    imageAlt: "Jetro Rafael performing on stage in a black hat and blazer.",
    imageAspectClassName: "aspect-[392/239]",
    imagePosition: "50% 100%",
  },
];

const talkFilters = ["All", ...new Set(talks.map((talk) => talk.category))];

function WatchNowButton({ href }: { href: string }) {
  return (
    <a
      className="inline-flex h-[38px] w-[150px] items-center justify-center rounded-[5px] border border-tedx-accent text-[16px] font-bold uppercase tracking-[0.01em] text-tedx-accent transition-colors duration-200 hover:bg-tedx-accent hover:text-tedx-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black"
      href={href}
      rel="noreferrer noopener"
      target="_blank"
    >
      WATCH NOW
    </a>
  );
}

function TalkItem({ talk }: { talk: TalkCard }) {
  return (
    <article className="flex w-full max-w-[392px] flex-col gap-6">
      <div
        className={`relative w-full overflow-hidden bg-tedx-surface-deep ${talk.imageAspectClassName}`}
      >
        <Image
          fill
          alt={talk.imageAlt}
          className="object-cover"
          sizes="(min-width: 1280px) 392px, (min-width: 640px) calc((100vw - 5rem) / 2), calc(100vw - 2rem)"
          src={talk.imageSrc}
          style={talk.imagePosition ? { objectPosition: talk.imagePosition } : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[12px] leading-6 text-tedx-accent">{talk.category}</p>
        <h3 className="text-[18px] font-bold leading-6 text-tedx-white">
          {talk.title}
        </h3>
        <p className="text-[12px] leading-6 text-tedx-muted-text">
          {talk.speaker}
        </p>
      </div>

      <WatchNowButton href={talk.href} />
    </article>
  );
}

export default function PastTalksSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const filteredTalks =
    activeFilter === "All"
      ? talks
      : talks.filter((talk) => talk.category === activeFilter);

  return (
    <section
      id="past-talks"
      aria-labelledby="past-talks-heading"
      className="bg-tedx-black px-4 py-20 text-tedx-white sm:px-6 lg:px-0 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <h2
          id="past-talks-heading"
          className="tedx-section-heading-shadow font-league-gothic text-center text-[4rem] leading-[0.8] tracking-[-0.04em] text-tedx-white sm:text-[5.5rem] lg:text-[128px] lg:leading-[0.734375]"
        >
          <span>PAST </span>
          <span className="text-tedx-accent">TALKS</span>
        </h2>

        <div className="mt-8 flex w-full max-w-[1248px] justify-end lg:mt-9">
          <div className="relative" ref={filterRef}>
            <div className="flex items-center gap-[10px]">
              <span className="text-[16px] leading-none text-tedx-white">
                Filter by:
              </span>

              <button
                aria-expanded={isFilterOpen}
                aria-haspopup="listbox"
                className="inline-flex h-[39px] w-[105px] items-center justify-center gap-[10px] rounded-[5px] bg-tedx-accent px-5 text-[16px] text-tedx-white transition-colors duration-200 hover:bg-tedx-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black"
                type="button"
                onClick={() => setIsFilterOpen((currentValue) => !currentValue)}
              >
                <span className="max-w-[3.25rem] truncate text-center">
                  {activeFilter}
                </span>
                <svg
                  aria-hidden="true"
                  className={`h-2 w-4 shrink-0 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 16 8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.25L8 6.25L15 1.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>

            {isFilterOpen ? (
              <div className="tedx-popover-shadow absolute right-0 top-[calc(100%+0.75rem)] z-20 min-w-[220px] rounded-[10px] border border-tedx-outline-strong bg-tedx-surface p-2">
                <ul role="listbox" aria-label="Past talks categories">
                  {talkFilters.map((filterOption) => {
                    const isActive = filterOption === activeFilter;

                    return (
                      <li key={filterOption}>
                        <button
                          className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm transition-colors duration-150 ${isActive ? "bg-tedx-accent text-tedx-white" : "text-tedx-white hover:bg-tedx-surface-muted"}`}
                          type="button"
                          onClick={() => {
                            setActiveFilter(filterOption);
                            setIsFilterOpen(false);
                          }}
                        >
                          <span>{filterOption}</span>
                          {isActive ? (
                            <span className="text-xs uppercase tracking-[0.12em]">
                              On
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid w-full max-w-[1248px] justify-items-center gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-[36px] lg:gap-y-[66px] xl:grid-cols-3">
          {filteredTalks.map((talk) => (
            <TalkItem key={`${talk.category}-${talk.speaker}`} talk={talk} />
          ))}
        </div>
      </div>
    </section>
  );
}
