"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useState } from "react";

import { leagueGothic } from "@/app/fonts";
import { MERCH_ORDER_PLACEHOLDER_URL } from "@/app/shop/constants";

type MerchPick = {
  id: string;
  title: string;
  imageSrc: string;
  ctaHref: string;
};

const MERCH_BG_BLUR_SRC = "/merch-bg-blur.svg";
const HEADING_GRADIENT = "var(--tedx-top-picks-heading-gradient)";
const HEADING_SHARP_MASK = "var(--tedx-top-picks-heading-mask-sharp)";
const HEADING_BLUR_MASK = "var(--tedx-top-picks-heading-mask-blur)";

const FEATURED_MERCH: MerchPick[] = [
  {
    id: "one-whole-zip",
    title: "One Whole Zip",
    imageSrc: "/tshirt.png",
    ctaHref: MERCH_ORDER_PLACEHOLDER_URL,
  },
  {
    id: "red-thread-theory",
    title: "Red Thread Theory",
    imageSrc: "/tshirt.png",
    ctaHref: MERCH_ORDER_PLACEHOLDER_URL,
  },
  {
    id: "static-pulse",
    title: "Static Pulse",
    imageSrc: "/tshirt.png",
    ctaHref: MERCH_ORDER_PLACEHOLDER_URL,
  },
];

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`tedx-chevron-glow h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${
        direction === "right" ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 34 85"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29 3L6 42.5L29 82"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
    </svg>
  );
}

export default function TopPicksSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activePick = FEATURED_MERCH[currentIndex];
  const slideTransform = { transform: `translateX(-${currentIndex * 100}%)` };

  const showPrevious = () => {
    startTransition(() => {
      setCurrentIndex((index) => (index - 1 + FEATURED_MERCH.length) % FEATURED_MERCH.length);
    });
  };

  const showNext = () => {
    startTransition(() => {
      setCurrentIndex((index) => (index + 1) % FEATURED_MERCH.length);
    });
  };

  return (
    <section
      aria-labelledby="top-picks-heading"
      className="relative isolate overflow-hidden bg-tedx-black py-12 text-tedx-white sm:py-16 lg:min-h-[52rem] lg:py-[5.375rem]"
      id="top-picks"
    >
      <h2 className="sr-only" id="top-picks-heading">
        Our Top Merch Picks
      </h2>
      <div aria-hidden="true" className="absolute inset-0 bg-tedx-black" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[54%] flex h-[min(150vw,68rem)] w-[min(150vw,68rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:top-[56.5%] sm:h-[min(117vw,105.757rem)] sm:w-[min(117vw,105.757rem)]"
      >
        <div className="relative flex h-[min(92vw,38rem)] w-[min(140vw,60rem)] rotate-45 items-center justify-center sm:h-[min(66vw,59.5rem)] sm:w-[min(100vw,90.0625rem)]">
          <div className="relative h-full w-full">
            <Image
              alt=""
              className="pointer-events-none select-none object-fill scale-[1.1] sm:scale-[1.14]"
              fill
              priority
              sizes="100vw"
              src={MERCH_BG_BLUR_SRC}
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col items-center px-4 sm:px-6 lg:px-0">
        <div
          aria-label="Featured merch picks"
          aria-roledescription="carousel"
          className="relative w-full"
        >
          <button
            aria-label="Show previous merch pick"
            className="absolute left-0 top-[52%] z-20 hidden -translate-y-1/2 p-1 text-tedx-white transition duration-200 hover:scale-105 hover:text-tedx-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tedx-white sm:left-4 md:block lg:left-[7.9%]"
            onClick={showPrevious}
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>

          <button
            aria-label="Show next merch pick"
            className="absolute right-0 top-[52%] z-20 hidden -translate-y-1/2 p-1 text-tedx-white transition duration-200 hover:scale-105 hover:text-tedx-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tedx-white sm:right-4 md:block lg:right-[7.9%]"
            onClick={showNext}
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>

          <div className="mx-auto flex w-full max-w-[68.25rem] flex-col items-center">
            <div className="relative flex w-full flex-col items-center pb-4 pt-1 text-center sm:pb-8 lg:pb-[4.375rem]">
              <div className="relative flex w-full justify-center">
                <p
                  aria-hidden="true"
                  className={`${leagueGothic.className} pointer-events-none absolute inset-0 mx-auto w-[min(92vw,20rem)] text-center text-[2.45rem] uppercase leading-[0.94] tracking-[-0.02em] text-transparent blur-[14px] sm:w-auto sm:max-w-none sm:text-[5.25rem] sm:leading-none sm:tracking-[-0.04em] lg:w-[57.875rem] lg:max-w-[57.875rem] lg:text-[128px] lg:tracking-[-5.12px]`}
                  style={{
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    backgroundImage: HEADING_GRADIENT,
                    WebkitMaskImage: HEADING_BLUR_MASK,
                    maskImage: HEADING_BLUR_MASK,
                  }}
                >
                  OUR TOP MERCH PICKS
                </p>
                <p
                  aria-hidden="true"
                  className={`${leagueGothic.className} relative w-[min(92vw,20rem)] text-center text-[2.45rem] uppercase leading-[0.94] tracking-[-0.02em] text-transparent sm:w-auto sm:max-w-none sm:text-[5.25rem] sm:leading-none sm:tracking-[-0.04em] lg:w-[57.875rem] lg:max-w-[57.875rem] lg:text-[128px] lg:tracking-[-5.12px]`}
                  style={{
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    backgroundImage: HEADING_GRADIENT,
                    WebkitMaskImage: HEADING_SHARP_MASK,
                    maskImage: HEADING_SHARP_MASK,
                  }}
                >
                  OUR TOP MERCH PICKS
                </p>
              </div>

              <div className="relative z-10 -mt-2 w-full overflow-hidden sm:-mt-10 lg:-mt-[4.65rem]">
                <div
                  className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={slideTransform}
                >
                  {FEATURED_MERCH.map((pick, index) => (
                    <div className="w-full shrink-0 px-2" key={pick.id}>
                      <p
                        aria-live={currentIndex === index ? "polite" : "off"}
                        className="text-center font-sans text-[2rem] font-normal leading-[0.95] tracking-[-0.04em] text-tedx-white sm:text-[3.5rem] sm:leading-none lg:text-[64px] lg:leading-[160px] lg:tracking-[-2.56px]"
                      >
                        {pick.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-2 flex w-full max-w-[33rem] flex-col items-center md:mt-[-0.25rem] md:max-w-[46.5625rem] md:justify-center">
              <div className="w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={slideTransform}
                >
                  {FEATURED_MERCH.map((pick, index) => (
                    <article className="w-full shrink-0" key={pick.id}>
                      <Image
                        alt={`${pick.title} TEDx shirt`}
                        className="h-auto w-full select-none"
                        height={525}
                        priority={index === 0}
                        src={pick.imageSrc}
                        width={745}
                      />
                    </article>
                  ))}
                </div>
              </div>

              <Link
                className="mt-2 inline-flex items-center justify-center whitespace-nowrap px-5 py-3 text-[1.9rem] font-normal leading-none tracking-[-0.04em] text-tedx-white transition duration-200 hover:text-tedx-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tedx-white md:absolute md:bottom-[14%] md:left-1/2 md:mt-0 md:-translate-x-1/2 md:text-[clamp(2.25rem,4.6vw,3rem)]"
                href={activePick.ctaHref}
                rel="noreferrer"
                target="_blank"
              >
                Order Now
              </Link>

              <div className="mt-3 flex w-full max-w-[10rem] items-center justify-between md:hidden">
                <button
                  aria-label="Show previous merch pick"
                  className="p-1 text-tedx-white transition duration-200 hover:scale-105 hover:text-tedx-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tedx-white"
                  onClick={showPrevious}
                  type="button"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  aria-label="Show next merch pick"
                  className="p-1 text-tedx-white transition duration-200 hover:scale-105 hover:text-tedx-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tedx-white"
                  onClick={showNext}
                  type="button"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
