import Reveal from "@/app/components/Reveal";

export default function WhatIsTedxSection() {
  return (
    <section id="what-is-tedx" className="relative w-full bg-black overflow-hidden md:min-h-[900px]">
      {/* Content — stacks on mobile, left column on desktop */}
      <div className="relative z-10 py-12 md:py-28 px-6 md:pl-20">
        <div className="w-full md:w-[38%] flex flex-col gap-8 md:gap-10">
          {/* Heading */}
          <Reveal variant="fade-right">
            <h2
              className="font-display text-white leading-none tracking-[-0.04em] drop-shadow-[0px_4px_25px_rgba(0,0,0,0.35)]"
              style={{ fontSize: "clamp(4.5rem, 8vw, 8rem)" }}
            >
              WHAT IS
              <br />
              <span className="text-tedx-red">TEDx</span>?
            </h2>
          </Reveal>

          {/* Body */}
          <div className="font-sans text-base text-white space-y-5 w-full md:max-w-[382px] leading-[25px]">
            <Reveal variant="fade-up" delay={0.15}>
              <p>
                In the spirit of ideas worth spreading, TED has created a program
                called <strong className="text-tedx-red font-bold">TEDx</strong>.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={0.25}>
              <p>
                <strong className="text-tedx-red font-bold">TEDx is</strong> a
                program of local, self organized events that bring people together
                to share a TED-like experience. Our event is call TEDx (place),
                where x=independently organized TED event. At our TEDx (place)
                event, TEDTalks video and live speakers will combine to spark deep
                discussion and connection in a small group.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={0.35}>
              <p>
                The <strong className="text-tedx-red font-bold">TED</strong>{" "}
                Conference provides general guidance for the TEDx program, but
                individual TEDx events, including ours, are self-organized.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Illustration — flows below text on mobile, absolute on desktop */}
      <Reveal variant="fade-left" delay={0.2} className="relative md:absolute md:top-[5%] md:bottom-[5%] md:left-[35%] md:right-0 h-[440px] md:h-[90%] pointer-events-none">
        {/* Ground path */}
        <img
          src="/about/tedx/path.svg"
          alt=""
          className="absolute inset-0 w-full h-full"
        />

        {/* Crowd silhouettes */}
        <img
          src="/about/tedx/crowd.svg"
          alt=""
          className="absolute inset-0 w-full h-full"
        />

        {/* Red walking person */}
        <div
          className="absolute z-10 left-0 top-0 hidden md:block"
          style={{
            transform: "translate(-65%, -25%)",
            width: 50,
            height: 90,
            backgroundColor: "#eb0028",
            WebkitMaskImage: "url('/about/tedx/red-person.png')",
            maskImage: "url('/about/tedx/red-person.png')",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />

        {/* Chat bubbles */}
        <ChatBubble style={{ top: "28%", left: "25%" }} />
        <ChatBubble style={{ top: "15%", left: "55%" }} flipped />
        <ChatBubble style={{ top: "48%", left: "48%" }} />
        <ChatBubble style={{ top: "56%", left: "68%" }} flipped />
      </Reveal>

      {/* "Wondering" — desktop only */}
      <Reveal variant="fade-left" delay={0.4} className="hidden md:flex absolute top-8 right-8 z-20 flex-col items-end gap-3 text-white">
        <p className="font-sans text-base text-right leading-[25px]">
          Wondering what past
          <br />
          attendees have said?
        </p>
        <img
          src="/about/tedx/arrow.svg"
          alt="View past attendee testimonials"
          className="w-5 h-5"
          style={{ transform: "rotate(180deg)" }}
        />
      </Reveal>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-[80px] pointer-events-none z-10 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

function ChatBubble({
  style,
  flipped,
}: {
  style?: React.CSSProperties;
  flipped?: boolean;
}) {
  return (
    <div
      className="absolute"
      style={{
        width: 42,
        height: 34,
        ...style,
        transform: flipped ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      {/* Bubble body */}
      <div className="absolute top-0 left-0 w-full bg-white rounded-[6px]" style={{ height: 25 }} />
      {/* Dots */}
      <img
        src="/about/tedx/chat-bubble-dots.svg"
        alt=""
        className="absolute"
        style={{ width: 22, height: 5, top: 10, left: 10 }}
      />
      {/* Tail */}
      <img
        src="/about/tedx/chat-bubble-tail.svg"
        alt=""
        className="absolute"
        style={{ width: 10, height: 12, bottom: 0, left: 5 }}
      />
    </div>
  );
}
