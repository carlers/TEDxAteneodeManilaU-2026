export default function MissionVisionSection() {
  return (
    <section id="mission-vision" className="relative w-full flex items-center bg-tedx-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -mt-24"
        style={{ backgroundImage: "url('/about/mission-vision/bg-effect.png')" }}
        />

      <div className="container pt-48">
        <div className="relative z-10 w-full pb-36">
          <h1 className="font-sans font-bold leading-none tracking-tight text-right">
            <span className="block text-[100px] text-tedx-red">
              Our mission is
            </span>
            <span className="block text-[64px] text-tedx-white">
              to empower minds and inspire
            </span>
            <span className="block text-[64px] text-tedx-white">
              change that transcends
            </span>
            <span className="block text-[64px] text-tedx-white">
              generations.
            </span>
          </h1>
        </div>

        <div className="relative z-10 w-full py-24 mt-12 mb-48">
          <h1 className="font-sans font-bold leading-none tracking-tight">
            <span className="block text-[100px] ml-24 text-tedx-red">
              Our vision is
            </span>
            <span className="block text-[64px] ml-24 text-tedx-white">
              to inform, inspire, and create positive
            </span>
            <span className="block text-[64px] ml-24 text-tedx-white">
              change by providing talks for diverse 
            </span>
            <span className="block text-[64px] ml-24 text-tedx-white">
              voices to be heard.
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
