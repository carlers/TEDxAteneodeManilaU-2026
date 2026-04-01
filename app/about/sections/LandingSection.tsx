export default function LandingSection() {
  return (
    <section
      id="landing"
      className="relative h-screen w-full flex items-center overflow-hidden bg-tedx-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/about/landing/bg-ellipses.png')" }}
      />

      <div className="relative z-10 w-full">
        <h1 className="font-sans font-bold leading-none tracking-tight">
          <span className="block pl-12 text-[150px] text-tedx-red">
            TED<sup className="text-[0.55em]">x</sup> is a
          </span>
          <span className="block pl-36 text-[100px] text-tedx-white">
            nonprofit
          </span>
          <span className="block pl-48 text-[100px] text-tedx-white">
            organization
          </span>
          <span className="block pl-56 text-[100px] text-tedx-white">
            devoted to ideas
          </span>
          <span className="block pl-72 text-[100px] text-tedx-white">
            worth spreading
          </span>
        </h1>
      </div>
    </section>
  );
}