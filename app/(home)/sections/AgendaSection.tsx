const imgBg = "/agenda/bg.svg";

const schedule = [
  { event: "Registration", time: "12:00 PM" },
  { event: "Opening Ceremony", time: "12:00 PM" },
  { event: "Welcome Speech", time: "12:00 PM" },
  { event: "Talk 1", time: "12:00 PM" },
  { event: "Talk 2", time: "12:00 PM" },
  { event: "Lunch Break", time: "12:00 PM" },
  { event: "Talk 3", time: "12:00 PM" },
  { event: "Talk 4", time: "12:00 PM" },
  { event: "Vote of Thanks", time: "12:00 PM" },
  { event: "Closing Ceremony", time: "12:00 PM" },
];

export default function AgendaSection() {
  return (
    <section id="agenda" className="w-full bg-black relative overflow-hidden">
      {/* Background SVG — full width, behind everything (desktop only) */}
      <div
        className="hidden sm:block absolute left-0 right-0 top-[18%] pointer-events-none pb-10"
        style={{ aspectRatio: "1440 / 686" }}
      >
        <img src={imgBg} alt="" className="w-[100%] h-[90%]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 sm:pt-20 sm:pb-60">
        {/* Heading */}
        <h2
          className="font-display text-white text-center leading-none tracking-[-0.04em]"
          style={{
            fontSize: "clamp(3rem, 8.9vw, 128px)",
            textShadow: "0 4px 25px rgba(0,0,0,.35)",
          }}
        >
          THE <span className="text-tedx-red">AGENDA</span>
        </h2>

        {/* Schedule table */}
        <div className="relative mt-[clamp(1rem,5vw,20px)] w-full max-w-[665px] sm:max-w-[46%]">
          {/* Mobile bg */}
          <div
            className="sm:hidden absolute inset-x-[-4%] inset-y-[-4%] pointer-events-none bg-tedx-surface-muted border-x-2 border-tedx-red"
          />

          {/* Schedule rows */}
          <div className="relative flex flex-col gap-1 py-2 sm:pt-10 sm:pb-5">
            {schedule.map(({ event, time }) => (
              <div
                key={event}
                className="flex items-center gap-1.5 sm:gap-2.5 font-bold leading-[28px] sm:leading-[32px]"
                style={{ fontSize: "clamp(13px, 1.5vw, 22px)" }}
              >
                <p className="flex-1 text-right text-white">{event}</p>
                <p className="w-[30px] sm:w-[52px] text-center text-tedx-red shrink-0">X</p>
                <p className="flex-1 text-left text-white">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
