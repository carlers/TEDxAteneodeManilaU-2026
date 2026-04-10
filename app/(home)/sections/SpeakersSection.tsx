"use client";
import { useState } from "react";
import Reveal from "@/app/components/Reveal";

const imgSpotlight = "/speakers/spotlight.png";
const imgWall = "/speakers/hallway-wall.png";
const imgPerson = "/speakers/person-silhouette.png";
const imgDoorknob = "/speakers/doorknob.svg";

/* ── Door component ─────────────────────────────────────────────── */
function Door({
  number,
  isOpen,
  onClick,
  compact,
}: {
  number: number;
  isOpen: boolean;
  onClick: () => void;
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
            top: "30.64%",
            bottom: 0,
          }}
        >
          <img
            src={imgPerson}
            alt=""
            className="absolute max-w-none"
            style={{
              width: "108%",
              height: "106.87%",
              left: "-4%",
              top: "-0.06%",
            }}
          />
        </div>
        <p
          className="absolute font-display text-white text-center tracking-[-0.96px] whitespace-nowrap"
          style={{
            left: "calc(121.2% + 50%)",
            transform: "translateX(-50%)",
            top: "5%",
            fontSize: numSize,
          }}
        >
          {number}
        </p>

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

  const toggle = (id: number) => setOpenDoor(openDoor === id ? null : id);

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
                compact
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
