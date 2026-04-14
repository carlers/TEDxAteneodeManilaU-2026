"use client";
import { useState } from "react";
import Reveal from "@/app/components/Reveal";

const VENUE_NAME = "UP Town Center Cinema 2";
const VENUE_ADDRESS = "Katipunan Avenue, Diliman, Quezon City";
const VENUE_DETAILS =
  "Doors Open at 8:00 AM. Free parking will be available within the campus.";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=UP+Town+Center+Cinema+2+Quezon+City";
const EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.069332886801!2d121.07270047524041!3d14.652005675815792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b76f8a819f91%3A0xb0fb074f8ab5d8ac!2sAyala%20Malls%20Cinemas%20U.P.%20Town%20Center!5e0!3m2!1sen!2sph!4v1776166226536!5m2!1sen!2sph";

export default function VenueSection() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section id="venue" className="w-full bg-black relative overflow-hidden">
      {/* Heading */}
      <Reveal variant="fade-up" className="relative z-10 pt-8 sm:pt-12 pb-4 px-4">
        <h2
          className="font-display text-white text-center leading-none tracking-[-0.04em]"
          style={{
            fontSize: "clamp(3rem, 8.9vw, 128px)",
            textShadow: "0 4px 25px rgba(0,0,0,.35)",
          }}
        >
          THE <span className="text-tedx-red">VENUE</span>
        </h2>
      </Reveal>

      {/* Map area */}
      <Reveal variant="fade-up" delay={0.2} className="relative w-full" style={{ height: "clamp(300px, 40vw, 540px)" }}>
        {/* Google Maps embed — non-interactive */}
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            src={EMBED_URL}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue location map"
            style={{ filter: "grayscale(1) invert(1) contrast(1.2) hue-rotate(180deg) brightness(0.6)", pointerEvents: "none" }}
          />
        </div>

        {/* Click prompt — hidden when info is open */}
        {!showInfo && (
          <button
            onClick={() => setShowInfo(true)}
            className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer group"
          >
            <span className="font-bold text-tedx-red text-base">{"Click→"}</span>
            <img
              src="/venue/pin.svg"
              alt="Venue pin"
              className="w-10 h-10 drop-shadow-[0_0_12px_rgba(235,0,40,0.6)] group-hover:scale-110 transition-transform"
            />
          </button>
        )}

        {/* Open in Maps button */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 bg-tedx-accent px-4 py-1.5 rounded-[5px] font-bold text-white text-sm hover:bg-tedx-accent-hover transition-colors"
        >
          Open in Maps
        </a>

        {/* Info panel — slides in from right */}
        <div
          className={`absolute top-0 bottom-0 right-0 z-20 w-[90%] sm:w-[420px] transition-transform duration-500 ease-in-out ${
            showInfo ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Left gradient fade */}
          <div
            className="absolute inset-y-0 left-0 w-[60px] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.95) 100%)",
            }}
          />

          {/* Panel content */}
          <div className="absolute inset-y-0 left-[60px] right-0 bg-black flex flex-col">
            {/* Map thumbnail placeholder — gray area */}
            <div className="w-full h-[38%] bg-tedx-surface-muted flex items-center justify-center">
              <iframe
                src={EMBED_URL}
                className="w-full h-full border-0"
                loading="lazy"
                title="Venue close-up map"
                style={{ filter: "grayscale(1) invert(1) contrast(1.2) hue-rotate(180deg) brightness(0.6)" }}
              />
            </div>

            {/* Close triangle */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute left-0 cursor-pointer z-10"
              style={{ top: "38%" }}
              aria-label="Close venue info"
            >
              <img
                src="/venue/triangle.svg"
                alt=""
                className="w-10 h-10"
                style={{ transform: "rotate(-135deg)" }}
              />
            </button>

            {/* Venue info */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 gap-6">
              <div className="flex items-start gap-4">
                <img
                  src="/venue/location-icon.svg"
                  alt=""
                  className="w-6 h-8 shrink-0 mt-1"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-white text-lg sm:text-xl">
                    {VENUE_NAME}
                  </p>
                  <p className="text-[#d9d9d9] text-sm sm:text-base">
                    {VENUE_ADDRESS}
                  </p>
                </div>
              </div>
              <p className="text-white text-sm sm:text-base leading-relaxed">
                {VENUE_DETAILS}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
