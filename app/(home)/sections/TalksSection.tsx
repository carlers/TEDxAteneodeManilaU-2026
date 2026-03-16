const imgTalk1Band = "/talks/talk1-band.svg";
const imgTalk1Over = "/talks/talk1-over.svg";
const imgTalk2Band = "/talks/talk2-band.svg";
const imgTalk2Over = "/talks/talk2-over.svg";
const imgTalk3Band = "/talks/talk3-band.svg";
const imgTalk3Over = "/talks/talk3-over.svg";
const imgTalk4Band = "/talks/talk4-band.svg";
const imgTalk4Over = "/talks/talk4-over.svg";
const imgQuizBg    = "/talks/quiz-bg.svg";
const imgQuizBot   = "/talks/quiz-bot.svg";
const imgQuizTop   = "/talks/quiz-top.svg";
const imgQuizArrow = "/talks/quiz-arrow.svg";
const imgCrowd     = "/talks/crowd.png";

const v = (px: number) => `${((px / 1444) * 100).toFixed(3)}vw`;

// Shared hover classes
const hoverText  = "transition-colors duration-300 group-hover:text-[#d82d33]";
const hoverBand  = "transition-[filter] duration-300 group-hover:saturate-0 group-hover:brightness-[5]";

export default function TalksSection() {
  return (
    <section id="talks" className="w-full bg-black overflow-hidden">

      {/* ── Mobile (< md) ───────────────────────────────────────────── */}
      <div className="md:hidden py-14 px-6 flex flex-col gap-8">
        <h2 className="font-display text-white text-center leading-none"
            style={{ fontSize: "clamp(2.8rem,11vw,5rem)", letterSpacing: "-0.04em" }}>
          FEATURED <span className="text-tedx-red">TALKS</span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 1, lines: ["MIND IN", "MOTION"] },
            { id: 2, lines: ["THE DARK", "MOMENTUM"] },
            { id: 3, lines: ["SELF-", "MOMENTUM"] },
            { id: 4, lines: ["MOMENTUM'S", "MIRROR"] },
          ].map(({ id, lines }) => (
            <button key={id}
              className="relative bg-tedx-red aspect-square overflow-hidden cursor-pointer group transition-colors duration-300 group-hover:bg-white">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src={imgCrowd} alt="" className="absolute w-[200%] opacity-30"
                     style={{ bottom: 0, left: "-50%" }} />
              </div>
              <span className={`font-display text-black/25 absolute top-2 right-3 leading-none ${hoverText}`}
                    style={{ fontSize: "clamp(3rem,10vw,5rem)" }}>{id}</span>
              <div className="absolute bottom-3 left-3 text-left">
                {lines.map((l) => (
                  <p key={l} className={`font-display text-white leading-none ${hoverText}`}
                     style={{ fontSize: "clamp(1.3rem,5vw,2rem)" }}>{l}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
        <button className="mx-auto font-display text-black bg-white px-8 py-3 text-xl hover:bg-tedx-gray transition-colors">
          find which talk is for you
        </button>
      </div>

      {/* ── Desktop (md+): 1:1 Figma X-pattern ─────────────────────── */}
      <div className="hidden md:block relative w-full" style={{ aspectRatio: "1444 / 1357" }}>

        {/* ── Talk 1 — top-left ─ "MIND IN MOTION" ─── */}
        <button className="absolute cursor-pointer group"
                style={{ left: "-0.14%", top: "1.47%", width: "49.97%", height: "49.41%" }}>
          <div className={`absolute ${hoverBand}`} style={{ inset: "-3.73% -3.47%" }}>
            <img src={imgTalk1Band} alt="" className="block w-full h-full max-w-none" />
          </div>
          <img src={imgTalk1Over} alt="" className={`absolute inset-0 w-full h-full ${hoverBand}`} />
          {/* Number */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "53.54%", right: "43.2%", bottom: "33.56%", left: "36.04%" }}>
            <div style={{ flexShrink: 0, width: v(29), height: v(144), transform: "rotate(-30deg) skewX(30deg) scaleY(0.87)" }}>
              <p className="font-display text-[#2f2f2f] text-center whitespace-nowrap leading-none"
                 style={{ fontSize: v(120) }}>1</p>
            </div>
          </div>
          {/* Title */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "61.74%", right: "11.74%", bottom: "10.89%", left: "44.21%" }}>
            <div style={{ flexShrink: 0, width: v(175), height: v(192), transform: "rotate(-30deg) skewX(30deg) scaleY(0.87)" }}>
              <div className={`font-display text-white text-center whitespace-nowrap leading-none ${hoverText}`}
                   style={{ fontSize: v(80) }}>
                <p>MIND IN</p>
                <p>MOTION</p>
              </div>
            </div>
          </div>
        </button>

        {/* ── Talk 2 — top-right ─ "THE DARK MOMENTUM" ─ */}
        <button className="absolute cursor-pointer group"
                style={{ left: "49.72%", top: "2.06%", width: "49.97%", height: "48.97%" }}>
          <div className={`absolute inset-0 flex items-center justify-center ${hoverBand}`}>
            <div className="w-full h-full" style={{ transform: "scaleY(-1) rotate(180deg)" }}>
              <div className="relative w-full h-full">
                <div className="absolute" style={{ inset: "-3.76% -3.47%" }}>
                  <img src={imgTalk2Band} alt="" className="block w-full h-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center ${hoverBand}`}>
            <div className="w-full h-full" style={{ transform: "scaleY(-1) rotate(180deg)" }}>
              <div className="relative w-full h-full">
                <div className="absolute" style={{ inset: "-2.46% -2.27%" }}>
                  <img src={imgTalk2Over} alt="" className="block w-full h-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
          {/* Number */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "53.12%", right: "36.55%", bottom: "32.73%", left: "40.89%" }}>
            <div style={{ flexShrink: 0, width: v(44), height: v(144), transform: "skewX(-30deg) rotate(30deg) scaleY(0.87)" }}>
              <p className="font-display text-[#2f2f2f] text-center whitespace-nowrap leading-none"
                 style={{ fontSize: v(120) }}>2</p>
            </div>
          </div>
          {/* Title */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "58.24%", right: "38.24%", bottom: "7.83%", left: "7.62%" }}>
            <div style={{ flexShrink: 0, width: v(259), height: v(192), transform: "skewX(-30deg) rotate(30deg) scaleY(0.87)" }}>
              <div className={`font-display text-white text-center whitespace-nowrap leading-none ${hoverText}`}
                   style={{ fontSize: v(80) }}>
                <p>THE DARK</p>
                <p>MOMENTUM</p>
              </div>
            </div>
          </div>
        </button>

        {/* ── Talk 3 — bottom-left ─ "SELF-MOMENTUM" ─── */}
        <button className="absolute cursor-pointer group"
                style={{ left: 0, top: "50.85%", width: "50.1%", height: "49.15%" }}>
          <div className={`absolute inset-0 flex items-center justify-center ${hoverBand}`}>
            <div className="w-full h-full" style={{ transform: "scaleY(-1)" }}>
              <div className="relative w-full h-full">
                <div className="absolute" style={{ inset: "-3.75% -3.46%" }}>
                  <img src={imgTalk3Band} alt="" className="block w-full h-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center ${hoverBand}`}>
            <div className="w-full h-full" style={{ transform: "scaleY(-1)" }}>
              <div className="relative w-full h-full">
                <div className="absolute" style={{ inset: "-2.46% -2.27%" }}>
                  <img src={imgTalk3Over} alt="" className="block w-full h-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
          {/* Number */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "31.78%", right: "43.18%", bottom: "54.2%", left: "34.42%" }}>
            <div style={{ flexShrink: 0, width: v(43), height: v(144), transform: "skewX(-30deg) rotate(30deg) scaleY(0.87)" }}>
              <p className="font-display text-[#2f2f2f] text-center whitespace-nowrap leading-none"
                 style={{ fontSize: v(120) }}>3</p>
            </div>
          </div>
          {/* Title */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "6.22%", right: "9.9%", bottom: "59.97%", left: "36.08%" }}>
            <div style={{ flexShrink: 0, width: v(259), height: v(192), transform: "skewX(-30deg) rotate(30deg) scaleY(0.87)" }}>
              <div className={`font-display text-white text-center whitespace-nowrap leading-none ${hoverText}`}
                   style={{ fontSize: v(80) }}>
                <p>SELF-</p>
                <p>MOMENTUM</p>
              </div>
            </div>
          </div>
        </button>

        {/* ── Talk 4 — bottom-right ─ "MOMENTUM'S MIRROR" */}
        <button className="absolute cursor-pointer group"
                style={{ left: "50.1%", top: "50.85%", width: "49.97%", height: "48.38%" }}>
          <div className={`absolute inset-0 flex items-center justify-center ${hoverBand}`}>
            <div className="w-full h-full" style={{ transform: "rotate(180deg)" }}>
              <div className="relative w-full h-full">
                <div className="absolute" style={{ inset: "-3.81% -3.47%" }}>
                  <img src={imgTalk4Band} alt="" className="block w-full h-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center ${hoverBand}`}>
            <div className="w-full h-full" style={{ transform: "rotate(180deg)" }}>
              <img src={imgTalk4Over} alt="" className="absolute inset-0 w-full h-full" />
            </div>
          </div>
          {/* Number */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "32.14%", right: "33.06%", bottom: "53.62%", left: "44.49%" }}>
            <div style={{ flexShrink: 0, width: v(43), height: v(144), transform: "rotate(-30deg) skewX(30deg) scaleY(0.87)" }}>
              <p className="font-display text-[#2f2f2f] text-center whitespace-nowrap leading-none"
                 style={{ fontSize: v(120) }}>4</p>
            </div>
          </div>
          {/* Title */}
          <div className="absolute flex items-center justify-center"
               style={{ top: "5.79%", right: "34.67%", bottom: "56.89%", left: "6.51%" }}>
            <div style={{ flexShrink: 0, width: v(298), height: v(192), transform: "rotate(-30deg) skewX(30deg) scaleY(0.87)" }}>
              <div className={`font-display text-white text-center whitespace-nowrap leading-none ${hoverText}`}
                   style={{ fontSize: v(80) }}>
                <p>MOMENTUM&apos;S</p>
                <p>MIRROR</p>
              </div>
            </div>
          </div>
        </button>

        {/* ── Center quiz button ────────────────────────── */}
        <button className="absolute z-10 cursor-pointer hover:brightness-95 transition-[filter]"
                style={{ left: "30.26%", top: "37.07%", width: "39.2%", height: "27.52%" }}>
          <div className="absolute" style={{ top: "49.93%", left: 0, right: 0, bottom: 0 }}>
            <img src={imgQuizBot} alt="" className="absolute inset-0 w-full h-full" />
          </div>
          <img src={imgQuizBg} alt="" className="absolute inset-0 w-full h-full" />
          <div className="absolute" style={{ top: "49.26%", left: 0, right: 0, bottom: 0 }}>
            <img src={imgQuizTop} alt="" className="absolute inset-0 w-full h-full" />
          </div>
          <div className="absolute flex items-center justify-center"
               style={{ top: "34%", right: "34.3%", bottom: "36.79%", left: "32.69%" }}>
            <div style={{ flexShrink: 0, width: v(138), height: v(78), transform: "rotate(-31deg) skewX(30deg) scaleY(0.87)" }}>
              <p className="font-display text-center leading-none"
                 style={{ fontSize: v(300), color: "rgba(176,176,176,0.25)" }}>?</p>
            </div>
          </div>
          <div className="absolute flex items-center justify-center"
               style={{ top: "20.07%", right: "20.67%", bottom: "22.8%", left: "15.02%" }}>
            <div style={{ flexShrink: 0, width: v(290), height: v(132), transform: "rotate(-31deg) skewX(30deg) scaleY(0.87)" }}>
              <p className="font-display text-black text-center whitespace-pre leading-tight"
                 style={{ fontSize: v(80) }}>{`find which \ntalk is for you`}</p>
            </div>
          </div>
          <div className="absolute" style={{ top: "81.53%", right: "54.06%", bottom: "17.27%", left: "44.88%" }}>
            <img src={imgQuizArrow} alt="" className="w-full h-full object-contain" />
          </div>
        </button>

        {/* ── Section heading ───────────────────────────── */}
        <div className="absolute z-20 text-center"
             style={{ left: "49.72%", top: "1.47%", transform: "translateX(-50%)", width: "51.52%" }}>
          <p className="font-display text-white whitespace-nowrap leading-none"
             style={{ fontSize: v(128), letterSpacing: "-0.04em", textShadow: "0 4px 25px rgba(0,0,0,.35)" }}>
            FEATURED <span className="text-tedx-red">TALKS</span>
          </p>
        </div>

        {/* ── Gray bar ─────────────────────────────────── */}
        <div className="absolute bg-[#d9d9d9]"
             style={{ left: "36.36%", top: "11.86%", width: "26.94%", height: "1.84%" }} />

        {/* ── Crowd silhouettes ─────────────────────────── */}
        <div className="absolute overflow-hidden pointer-events-none"
             style={{ left: "-1.45%", top: "6.04%", width: "18.28%", height: "20.12%" }}>
          <div className="w-full h-full" style={{ transform: "scaleY(-1) rotate(180deg)" }}>
            <div className="relative w-full h-full overflow-hidden">
              <img src={imgCrowd} alt="" className="absolute max-w-none"
                   style={{ width: "315.79%", height: "171.97%", left: "-113.23%", top: "-35.95%" }} />
            </div>
          </div>
        </div>
        <div className="absolute overflow-hidden pointer-events-none"
             style={{ left: "80.40%", top: "11.05%", width: "18.21%", height: "19.09%" }}>
          <div className="relative w-full h-full overflow-hidden">
            <img src={imgCrowd} alt="" className="absolute max-w-none"
                 style={{ width: "301.89%", height: "171.97%", left: "-201.8%", top: "-15.28%" }} />
          </div>
        </div>
        <div className="absolute overflow-hidden pointer-events-none"
             style={{ left: 0, top: "71.78%", width: "16.83%", height: "18.50%" }}>
          <div className="relative w-full h-full overflow-hidden">
            <img src={imgCrowd} alt="" className="absolute max-w-none"
                 style={{ width: "315.79%", height: "171.97%", left: 0, top: "-71.97%" }} />
          </div>
        </div>
        <div className="absolute overflow-hidden pointer-events-none"
             style={{ left: "82.74%", top: "73.18%", width: "15.94%", height: "17.54%" }}>
          <div className="w-full h-full" style={{ transform: "scaleY(-1) rotate(180deg)" }}>
            <div className="relative w-full h-full overflow-hidden">
              <img src={imgCrowd} alt="" className="absolute max-w-none"
                   style={{ width: "391.26%", height: "213.07%", left: "-30.37%", top: "-92.37%" }} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
