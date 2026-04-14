"use client";

import { useState } from "react";
import posthog from "posthog-js";
import Reveal from "@/app/components/Reveal";

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M6 9l6 7 6-7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

const faqItems = [
  {
    question: "When and where will the event take place?",
    answer:
    "The event will take place on April 25 (Saturday), from 1:00 PM to 4:00 PM, at UP Town Center Cinema 2.",
  },
  {
    question: "Who can attend the event?",
    answer:
    "The event is open to everyone. All are welcome to join and be part of the experience.",
  },
  {
    question: "What should I expect during the event?",
    answer:
    "TEDxAteneo de Manila U features a dynamic lineup of speakers, interactive activities, concessionaires, and performances. Participants can explore booths, listen to talks from individuals across various fields, enjoy performances by local artists, and engage in meaningful discussions centered on the theme Momentum.",
  },
  {
    question: "Will the event be livestreamed or recorded?",
    answer:
    "The event will not be livestreamed. However, the talks will be recorded and submitted to TEDx for possible publication.",
  },
  {
    question: "What is the theme of this event?",
    answer:
      "This year’s theme is TEDxAteneodeManilaU: Momentum. Momentum is more than speed—it is the tension between stillness and motion, between holding on and letting go. It reflects the paradox that drives us forward: the more we strive, the more we risk emptiness; the more we stay content, the more we risk complacency.",
  },
  {
    question: "Is TEDxAteneo de Manila U an organization?",
    answer:
      "TEDxAteneo de Manila U is not currently an independent organization within Ateneo de Manila University. It operates under the Ateneo Management Association (AMA), the premier entrepreneurship organization of the university. AMA is home to students pursuing BS Management, BS Management-Honors, and Management minors, and is one of the largest organizations within the Business Cluster of the Council of Organizations.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleItem = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex((current) => (current === index ? -1 : index));
    if (isOpening) {
      posthog.capture("faq_item_expanded", { question: faqItems[index]?.question, index });
    }
  };

  return (
    <section
      id="faq"
      className="w-full bg-black px-4 py-12 sm:px-6 md:px-8 md:py-[68px] lg:px-12 xl:px-[120px]"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <Reveal variant="fade-left" className="flex shrink-0 flex-col items-start gap-[10px] lg:w-[540px] lg:pt-4 xl:w-[640px]">
          <h2
            className="font-display text-[clamp(2.4rem,12vw,150px)] leading-[0.94] tracking-[-0.04em] text-white"
            style={{
              textShadow: "0 4px 25px rgba(0,0,0,.35)",
            }}
          >
            FREQUENTLY
            <br />
            <span className="text-tedx-red">X</span>SKED QUESTION<span className="text-tedx-red">X</span>
          </h2>
        </Reveal>
        <Reveal variant="fade-up" delay={0.1} className="w-full lg:max-w-[680px] xl:max-w-[720px]">
          <div className="flex flex-col gap-5">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={item.question}
                  className="rounded-[16px] border border-tedx-outline-strong bg-tedx-surface-muted px-4 py-5 sm:px-6 sm:py-7 md:px-7 md:py-8"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <h3 className="text-base font-semibold leading-tight text-tedx-white sm:text-[18px]">
                      {item.question}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center justify-center ${
                        isOpen ? "text-tedx-red" : "text-tedx-muted-text"
                      }`}
                      aria-hidden="true"
                    >
                      <span className="relative inline-flex h-6 w-6 items-center justify-center">
                        <span
                          className={`absolute transition-all duration-300 ease-out ${
                            isOpen ? "scale-75 opacity-0" : "scale-100 opacity-100"
                          }`}
                        >
                          <ChevronDownIcon />
                        </span>
                        <span
                          className={`absolute transition-all duration-300 ease-out ${
                            isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
                          }`}
                        >
                          <CloseIcon />
                        </span>
                      </span>
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${index}`}
                    className={`grid overflow-hidden transition-all duration-300 ease-out ${
                      isOpen ? "mt-7 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[1000px] text-sm leading-[1.55] text-tedx-muted-text sm:text-[16px] sm:leading-[1.45]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
