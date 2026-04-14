import Reveal from "@/app/components/Reveal";

export default function WhatIsTedxSection() {
  return (
    <section id="what-is-tedx" className="relative w-full bg-black overflow-hidden md:min-h-[900px]">
      {/* Content — stacks on mobile, left column on desktop */}
      <div className="relative z-10 py-12 md:py-28 px-6 md:pl-20 pointer-events-none">
        <div className="w-full md:w-[38%] flex flex-col gap-8 md:gap-10 pointer-events-auto">
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
      <Reveal variant="fade-left" delay={0.2} className="relative z-20 md:absolute md:top-[5%] md:bottom-[5%] md:left-[35%] md:right-0 h-[440px] md:h-[90%]">
        {/* Ground path */}
        <img
          src="/about/tedx/path.svg"
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Crowd silhouettes */}
        <img
          src="/about/tedx/crowd.svg"
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
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
        <ChatBubble
          style={{ top: "28%", left: "25%" }}
          author="Isaiah Fermantez"
          year="2025"
          attendee="MarkStrat Core"
          quote="At first, I was wary of the scale. But working alongside such a strong and dedicated team made everything come together. Being part of TEDxAteneodeManilaU resonates deeply with me because it stands as a platform where voices are not just heard, but valued. It reminded me that no voice is too small to deserve a stage. I’m grateful to have played a role in helping these ideas reach more people."
        />
        <ChatBubble
          style={{ top: "15%", left: "55%" }}
          tailSide="right"
          author="Ania Ng"
          year="2025"
          attendee="Stakeholder Management Associate"
          quote="Working in TEDx has been an eye-opening experience. I was exposed to different perspectives presented by our speakers and connect with them. It truly is a unique opportunity to hear more about the unheard stories and topics, and how they have deeply affected others. TEDx is an opportunity to listen and connect."
        />
        <ChatBubble
          style={{ top: "48%", left: "48%" }}
          author="Julianne Go"
          year="2026"
          attendee="Creatives Deputy"
          quote="I joined TED because I saw how different it was from the other organizations and liked the challenge of designing for a new audience. I had so much fun in my time as a core team member for TEDx, and it is one of my favorite projects in college. It was so rewarding to see everything take place and see the progress that led to the final event. The team even had my design as the core team shirt, so I was very happy to see things come to life."
        />
        <ChatBubble
          style={{ top: "56%", left: "68%" }}
          tailSide="right"
          author="Zach Iglesia"
          year="2026"
          attendee="Entertainment Associate"
          quote="What stood out most was how welcoming the community was. People from different fields connected instantly."
        />
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
  tailSide = "left",
  quote,
  author,
  year,
  attendee,
}: {
  style?: React.CSSProperties;
  tailSide?: "left" | "right";
  quote: string;
  author: string;
  year: string;
  attendee: string;
}) {
  return (
    <div
      className="absolute z-20 hidden h-[34px] w-[42px] md:block"
      style={{
        ...style,
      }}
      aria-label={`Testimonial from ${author}`}
    >
      <button
        type="button"
        className="group absolute right-0 top-0 h-[34px] w-[42px] cursor-pointer bg-transparent p-0 text-left transition-all duration-300 ease-out hover:h-[248px] hover:w-[420px] focus-visible:h-[248px] focus-visible:w-[420px]"
        aria-label={`View testimonial from ${author}`}
      >
        <div className="absolute left-0 top-0 h-[25px] w-[42px] rounded-[6px] bg-white transition-all duration-300 ease-out group-hover:h-full group-hover:w-full group-hover:rounded-[40px] group-focus-visible:h-full group-focus-visible:w-full group-focus-visible:rounded-[40px] tedx-popover-shadow" />

        <img
          src="/about/tedx/chat-bubble-dots.svg"
          alt=""
          className="absolute left-[10px] top-[10px] h-[5px] w-[22px] transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
        />

        <img
          src="/about/tedx/chat-bubble-tail.svg"
          alt=""
          className="absolute bottom-0 h-[12px] w-[10px] transition-all duration-300 ease-out group-hover:bottom-[-20px] group-hover:h-[26px] group-hover:w-[22px] group-focus-visible:bottom-[-20px] group-focus-visible:h-[26px] group-focus-visible:w-[22px]"
          style={{
            left: tailSide === "left" ? 5 : undefined,
            right: tailSide === "right" ? 5 : undefined,
            transform: tailSide === "right" ? "scaleX(-1)" : undefined,
            transformOrigin: tailSide === "right" ? "center" : undefined,
          }}
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="font-sans text-[12px] leading-7 text-tedx-black">{quote}</p>
          <p className="mt-3 text-right font-sans text-[15px] font-semibold leading-6 text-tedx-black">
            {author} <span className="font-medium text-tedx-muted-text">| {year} {attendee}</span>
          </p>
        </div>
      </button>
    </div>
  );
}
