type LeaderCard = {
  name: string;
  role: string;
  description: string;
};

const leaders: LeaderCard[] = [
  {
    name: "LOREM IPSUM",
    role: "PROJECT SUPERVISOR",
    description: "Phasellus imperdiet auctor aliquet. Mauris non consequat ipsum.",
  },
  {
    name: "LOREM IPSUM",
    role: "PROJECT SUPERVISOR",
    description: "Phasellus imperdiet auctor aliquet. Mauris non consequat ipsum.",
  },
  {
    name: "LOREM IPSUM",
    role: "PROJECT SUPERVISOR",
    description: "Phasellus imperdiet auctor aliquet. Mauris non consequat ipsum.",
  },
  {
    name: "LOREM IPSUM",
    role: "PROJECT SUPERVISOR",
    description: "Phasellus imperdiet auctor aliquet. Mauris non consequat ipsum.",
  },
  {
    name: "LOREM IPSUM",
    role: "PROJECT SUPERVISOR",
    description: "Phasellus imperdiet auctor aliquet. Mauris non consequat ipsum.",
  },
  {
    name: "LOREM IPSUM",
    role: "PROJECT SUPERVISOR",
    description: "Phasellus imperdiet auctor aliquet. Mauris non consequat ipsum.",
  },
];

export default function LeadersSection() {
  return (
    <section
      id="leaders"
      aria-labelledby="leaders-heading"
      className="w-full bg-tedx-black px-4 py-16 text-tedx-white sm:px-6 lg:px-0 lg:py-[88px]"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mx-auto max-w-[780px] text-center">
          <h2
            id="leaders-heading"
            className="font-league-gothic tedx-section-heading-shadow text-[4.1rem] leading-[0.82] tracking-[-0.03em] text-tedx-white sm:text-[5.5rem] lg:text-[122px] lg:leading-none"
          >
            THE LEADERS
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[18px] leading-[1.25] text-tedx-muted-text">
            Mauris non consequat ipsum. Vestibulum et neque id risus ultricies
            fringilla. Donec ante nisi, lobortis quis ornare a.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-[72px] lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {leaders.map((leader, index) => (
            <article
              key={`${leader.name}-${index}`}
              className="relative mx-auto flex w-full max-w-[238px] flex-col items-center overflow-hidden bg-gradient-to-b from-tedx-accent-strong via-tedx-red to-tedx-accent-shadow px-4 pb-[228px] pt-[36px] text-center"
            >
              <h3 className="text-[25px] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-tedx-white">
                {leader.name}
              </h3>
              <p className="mt-2 text-[18px] leading-[0.95] tracking-[-0.02em] text-tedx-white/85">
                {leader.role}
              </p>
              <p className="mt-6 max-w-[190px] text-[18px] leading-[1.18] text-tedx-white/85 pb-6">
                {leader.description}
              </p>

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[220px]"
              >
                <span className="absolute left-1/2 top-[0px] h-[88px] w-[88px] -translate-x-1/2 rounded-full bg-tedx-black" />
                <span className="absolute bottom-0 left-1/2 h-[140px] w-[176px] -translate-x-1/2 rounded-t-[999px] bg-tedx-black" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
