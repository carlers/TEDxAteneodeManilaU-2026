export default function LandingSection() {
  return (
    <section
      id="landing"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-tedx-black px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-0"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/about/landing/bg-ellipses.png')" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <h1 className="max-w-[12ch] font-sans font-bold leading-[0.92] tracking-tight sm:max-w-[13ch] md:max-w-none">
          <span className="block text-[clamp(3.5rem,14vw,150px)] text-tedx-red sm:pl-4 sm:text-[5.5rem] md:pl-10 md:text-[7rem] lg:pl-12 lg:text-[150px]">
            TED<sup className="text-[0.55em]">x</sup> is a
          </span>
          <span className="block text-[clamp(2.25rem,9vw,100px)] text-tedx-white sm:pl-12 sm:text-[4rem] md:pl-24 md:text-[5rem] lg:pl-36 lg:text-[100px]">
            nonprofit
          </span>
          <span className="block text-[clamp(2.25rem,9vw,100px)] text-tedx-white sm:pl-16 sm:text-[4rem] md:pl-32 md:text-[5rem] lg:pl-48 lg:text-[100px]">
            organization
          </span>
          <span className="block text-[clamp(2.25rem,9vw,100px)] text-tedx-white sm:pl-20 sm:text-[4rem] md:pl-40 md:text-[5rem] lg:pl-56 lg:text-[100px]">
            devoted to ideas
          </span>
          <span className="block text-[clamp(2.25rem,9vw,100px)] text-tedx-white sm:pl-24 sm:text-[4rem] md:pl-48 md:text-[5rem] lg:pl-72 lg:text-[100px]">
            worth spreading
          </span>
        </h1>
      </div>
    </section>
  );
}