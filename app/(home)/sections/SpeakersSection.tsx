"use client";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import Reveal from "@/app/components/Reveal";

const imgSpotlight = "/speakers/spotlight.png";
const imgWall = "/speakers/hallway-wall.png";
const imgDoorknob = "/speakers/doorknob.svg";

const speakerDetails = [
  {
    id: 1,
    talkTitle: "Mind in Motion: Riding the AI Wave",
    speakerLabel: "Dominic “Doc” Ligot",
    description:
      "This talk explores how AI is reshaping how Gen Z thinks, learns, and creates. Through a live human-vs-AI exchange, it shows how young people can not only ride AI's momentum, but steer it responsibly.",
    bio:
      "Dominic “Doc” Ligot is a technologist and entrepreneur recognized as a leading voice in AI in the Philippines. He is the founder of CirroLytix and Data & AI Ethics PH, and serves on the board of the Philippine Artificial Intelligence Business Association as Director for AI Ethics and Data Governance.",
    images: [{ src: "/speakers/ligot.webp", alt: "Dominic Doc Ligot" }],
  },
  {
    id: 2,
    talkTitle: "Dark Momentum",
    speakerLabel: "Jamie Lim",
    description:
      "The dark momentum represents the unnoticed side of progress. It dives into the pressure, anxiety, and harmful trade-offs that can come with ambition. In sports, it asks how we pursue success while recognizing that there are things more important than winning: not winning by any means, but winning honestly.",
    bio:
      "Jamie Christine Lim is a Filipino karate athlete, courtside reporter, and public figure. A Southeast Asian Games gold medalist, she also graduated summa cum laude in Mathematics from the University of the Philippines Diliman and continues to inspire both on and off the mat.",
    images: [{ src: "/speakers/jamie.webp", alt: "Jamie Lim" }],
  },
  {
    id: 3,
    talkTitle: "Self-Momentum: The New Currency of Meaning",
    speakerLabel: "Eugene Dela Cruz",
    description:
      "Love becomes more complex as we grow, shaped by memory, biology, culture, and choice. In that complexity, we ask whether love is created or destined. Ultimately, love is momentum: it carries us through loss, growth, and meaning.",
    bio:
      "Eugene Dela Cruz, an Honorable Mention graduate of Ateneo Class of 2025 in Economics (Honors Program), also earned Third Best Undergraduate Thesis in his batch. Once a street dweller, he defied the odds through resilience and perseverance, and now works as a business analyst at Kearney.",
    images: [{ src: "/speakers/eugene.webp", alt: "Eugene Dela Cruz" }],
  },
  {
    id: 4,
    talkTitle: "Momentum's Mirror: The Realm of Generations",
    speakerLabel: "Jenn Vela and Janina Vela",
    description:
      "We live in paradox. What moves us forward can also weigh us down: growth and limits, more and enough. For Gen Z, endless choices bring freedom and overwhelm, while both ambition and contentment carry their own risks. Momentum is finding meaning in the tension between them.",
    bio:
      "Jenn and Janina Vela are a dynamic mother-daughter duo who bring together wisdom through their stories. Jenn offers grounded insight shaped by faith and life experience, while Janina, a Gen Z thought leader and social advocate, uses her platform to spark conversations on identity, purpose, and impact.",
    images: [
      { src: "/speakers/jenn.webp", alt: "Jenn Vela" },
      { src: "/speakers/janina.webp", alt: "Janina Vela" },
    ],
  },
];

const SPEAKER_IDS = new Set(speakerDetails.map((s) => s.id));

function parseSpeakerHash(hash: string): number | null {
  const match = /^#speaker-(\d+)$/i.exec(hash);
  if (!match) return null;
  const id = Number(match[1]);
  return SPEAKER_IDS.has(id) ? id : null;
}

function replaceUrlWithSpeakerHash(id: number | null) {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  const hash = id != null ? `#speaker-${id}` : "";
  const next = `${pathname}${search}${hash}`;
  if (`${pathname}${search}${window.location.hash}` !== next) {
    window.history.replaceState(null, "", next);
  }
}

/* ── Door component ─────────────────────────────────────────────── */
function Door({
  number,
  isOpen,
  onClick,
  revealImages,
  compact,
}: {
  number: number;
  isOpen: boolean;
  onClick: () => void;
  revealImages: string[];
  compact?: boolean;
}) {
  const ratio = compact ? "3 / 4" : "250 / 470";
  const xSize = compact ? "clamp(60px, 20vw, 100px)" : "clamp(150px, 34.7vw, 500px)";
  const numSize = compact ? "14px" : "clamp(14px, 1.67vw, 24px)";

  return (
    <div
      className="relative w-full overflow-clip cursor-pointer"
      style={{ aspectRatio: ratio }}
      onClick={onClick}
    >
      {/* Wrapper — slides left to reveal behind-door content */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{ transform: isOpen ? "translateX(-121.2%)" : "translateX(0)" }}
      >
        {/* ── Behind the door ── */}
        <div
          className="absolute bg-[#d82d33]"
          style={{ inset: "0 -121.2% 0 121.2%" }}
        />
        <div
          className="absolute overflow-hidden"
          style={{
            left: "121.2%",
            right: "-121.2%",
            top: 0,
            bottom: 0,
          }}
        >
          {revealImages.length > 1 ? (
            <div className="grid h-full w-full grid-cols-2">
              {revealImages.slice(0, 2).map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-full w-full object-cover object-[50%_18%]"
                />
              ))}
            </div>
          ) : (
            <img
              src={revealImages[0]}
              alt=""
              className="h-full w-full object-cover object-[50%_18%]"
            />
          )}
        </div>

        {/* ── Front face of door ── */}
        <div className="absolute inset-0 bg-black border border-tedx-outline-strong rounded-sm" />
        <div
          className="absolute flex items-center justify-center overflow-hidden"
          style={{ inset: "10% 10%" }}
        >
          <p
            className="font-display text-tedx-red opacity-70 text-center leading-none tracking-[-0.04em]"
            style={{ fontSize: xSize }}
          >
            X
          </p>
        </div>
        <div
          className="absolute"
          style={{
            top: "47%",
            bottom: "47%",
            right: "7%",
            width: compact ? "8%" : "9.6%",
          }}
        >
          <img
            src={imgDoorknob}
            alt=""
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <p
          className="absolute font-display text-[#991a04] text-center tracking-[-0.96px] whitespace-nowrap left-1/2 -translate-x-1/2"
          style={{
            top: "5%",
            fontSize: numSize,
          }}
        >
          {number}
        </p>
      </div>
    </div>
  );
}

/* ── Wall crops per slot ────────────────────────────────────────── */
const slots = [
  {
    width: "30.64%",
    aspect: "424 / 559",
    crop: { width: "205.9%", height: "312.14%", left: "-36.99%", top: "-115.61%" },
    doorLeft: "38.68%",
    doorWidth: "58.96%",
    flip: false,
  },
  {
    width: "19.36%",
    aspect: "268 / 559",
    crop: { width: "325.76%", height: "312.14%", left: "-115.23%", top: "-115.61%" },
    doorLeft: "4.10%",
    doorWidth: "93.28%",
    flip: false,
  },
  {
    width: "19.36%",
    aspect: "268 / 559",
    crop: { width: "325.76%", height: "312.14%", left: "-115.23%", top: "-115.61%" },
    doorLeft: "4.48%",
    doorWidth: "93.28%",
    flip: false,
  },
  {
    width: "30.64%",
    aspect: "424 / 559",
    crop: { width: "205.9%", height: "312.14%", left: "-36.99%", top: "-115.61%" },
    doorLeft: "2.59%",
    doorWidth: "58.96%",
    flip: true,
  },
];

/* ── Section ────────────────────────────────────────────────────── */
export default function SpeakersSection() {
  const [openDoor, setOpenDoor] = useState<number | null>(null);
  const activeSpeaker = speakerDetails.find((speaker) => speaker.id === openDoor) ?? null;
  const revealImagesByDoor: Record<number, string[]> = {
    1: ["/speakers/ligot.webp"],
    2: ["/speakers/jamie.webp"],
    3: ["/speakers/eugene.webp"],
    4: ["/speakers/jenn.webp", "/speakers/janina.webp"],
  };

  useEffect(() => {
    const id = parseSpeakerHash(window.location.hash);
    if (id == null) return;
    queueMicrotask(() => {
      setOpenDoor(id);
    });
  }, []);

  useEffect(() => {
    if (openDoor == null) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`speaker-${openDoor}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [openDoor]);

  const toggle = (id: number) => {
    const next = openDoor === id ? null : id;
    setOpenDoor(next);
    replaceUrlWithSpeakerHash(next);
    if (next !== null) {
      const speaker = speakerDetails.find((s) => s.id === next);
      posthog.capture("speaker_door_opened", {
        speaker_id: next,
        speaker_name: speaker?.speakerLabel,
        talk_title: speaker?.talkTitle,
      });
    }
  };

  return (
    <section id="speakers" className="w-full bg-black relative overflow-hidden">
      {/* Spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[83.75%] opacity-80 pointer-events-none">
        <img src={imgSpotlight} alt="" className="w-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-7 pt-[13%] pb-[5%]">
        {/* Heading + subtitle */}
        <Reveal variant="fade-up" className="flex flex-col items-center gap-6 text-center text-white max-w-[752px]">
          <h2
            className="font-display leading-none tracking-[-0.04em]"
            style={{
              fontSize: "clamp(3rem, 8.9vw, 128px)",
              textShadow: "0 4px 25px rgba(0,0,0,.35)",
            }}
          >
            MEET THE SPEAKERS
          </h2>
          <p className="font-sans text-lg">
            Open the doors to see their details!
          </p>
        </Reveal>

        {/* ── Desktop hallway (md+) ──────────────────────────────── */}
        <div className="hidden md:flex w-full max-w-[1384px] mx-auto mt-[50px]">
          {slots.map((slot, i) => (
            <Reveal
              key={i}
              variant="fade-up"
              delay={0.15 + i * 0.12}
              className="relative shrink-0"
              style={{ width: slot.width, aspectRatio: slot.aspect }}
            >
              {/* Hallway wall image */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={slot.flip ? { transform: "scaleX(-1)" } : undefined}
              >
                <img
                  src={imgWall}
                  alt=""
                  className="absolute max-w-none"
                  style={slot.crop}
                />
              </div>
              {/* Door */}
              <div
                className="absolute"
                style={{
                  left: slot.doorLeft,
                  top: "1.61%",
                  width: slot.doorWidth,
                }}
              >
                <Door
                  number={i + 1}
                  isOpen={openDoor === i + 1}
                  onClick={() => toggle(i + 1)}
                  revealImages={revealImagesByDoor[i + 1]}
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Mobile doors (< md) ────────────────────────────────── */}
        <div className="md:hidden grid grid-cols-2 gap-5 mt-10 w-full max-w-[340px] mx-auto">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal
              key={n}
              variant="zoom-in"
              delay={0.1 + i * 0.1}
              className="relative rounded-t-md overflow-hidden"
              style={{
                border: "3px solid #eb0028",
                borderBottom: "6px solid #eb0028",
                background: "#1a1a1a",
              }}
            >
              <Door
                number={n}
                isOpen={openDoor === n}
                onClick={() => toggle(n)}
                revealImages={revealImagesByDoor[n]}
                compact
              />
            </Reveal>
          ))}
        </div>

        {activeSpeaker && (
          <div
            id={`speaker-${activeSpeaker.id}`}
            className="scroll-mt-24 mt-8 w-full max-w-[820px] md:mt-10"
          >
            <Reveal
              variant="fade-up"
              className="w-full rounded-xl border border-tedx-outline-strong bg-tedx-surface-muted p-4 md:p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tedx-red">
                Talk {activeSpeaker.id}
              </p>
              <h3 className="mt-2 font-display text-3xl leading-[0.95] text-tedx-white md:text-4xl">
                {activeSpeaker.talkTitle}
              </h3>
              <p className="mt-3 text-sm font-semibold text-tedx-white">
                Speaker: {activeSpeaker.speakerLabel}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-tedx-muted-text">
                {activeSpeaker.description}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-tedx-muted-text">
                {activeSpeaker.bio}
              </p>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
