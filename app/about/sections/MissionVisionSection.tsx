export default function MissionVisionSection() {
  return (
    <section
      id="mission-vision"
      className="relative w-full overflow-hidden bg-tedx-black px-4 py-16 text-tedx-white sm:px-6 sm:py-20 lg:px-0 lg:py-0"
    >
      <div
        className="absolute inset-0 -mt-12 bg-cover bg-center bg-no-repeat sm:-mt-24"
        style={{ backgroundImage: "url('/about/mission-vision/bg-effect.png')" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-16 lg:gap-0">
        <div className="pt-12 sm:pt-24 lg:pt-48">
          <h1 className="max-w-[16ch] text-right font-sans font-bold leading-[0.92] tracking-tight sm:ml-auto sm:max-w-none">
            <span className="block text-[clamp(3rem,12vw,100px)] text-tedx-red sm:text-[100px]">
              Our mission is
            </span>
            <span className="block text-[clamp(2rem,7.2vw,64px)] text-tedx-white sm:text-[64px]">
              to empower minds and inspire
            </span>
            <span className="block text-[clamp(2rem,7.2vw,64px)] text-tedx-white sm:text-[64px]">
              change that transcends
            </span>
            <span className="block text-[clamp(2rem,7.2vw,64px)] text-tedx-white sm:text-[64px]">
              generations.
            </span>
          </h1>
        </div>

        <div className="pb-8 pt-4 sm:py-16 lg:mb-48 lg:mt-12 lg:py-24">
          <h1 className="max-w-[18ch] font-sans font-bold leading-[0.92] tracking-tight sm:ml-auto sm:max-w-none lg:ml-24">
            <span className="block text-[clamp(3rem,12vw,100px)] text-tedx-red sm:text-[100px]">
              Our vision is
            </span>
            <span className="block text-[clamp(2rem,7.2vw,64px)] text-tedx-white sm:text-[64px]">
              to inform, inspire, and create positive
            </span>
            <span className="block text-[clamp(2rem,7.2vw,64px)] text-tedx-white sm:text-[64px]">
              change by providing talks for diverse
            </span>
            <span className="block text-[clamp(2rem,7.2vw,64px)] text-tedx-white sm:text-[64px]">
              voices to be heard.
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
