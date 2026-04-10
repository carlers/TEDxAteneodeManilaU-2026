const fields = [
  { label: "First Name", placeholder: "Juan Christian", type: "text" },
  { label: "Last Name", placeholder: "Dela Cruz", type: "text" },
  { label: "Age", placeholder: "21", type: "number" },
  { label: "Email Address", placeholder: "juandelacruz@student.ateneo.edu", type: "email" },
  { label: "Contact Number", placeholder: "0917 123 4567", type: "tel" },
];

export default function ContactUsSection() {
  return (
    <section
      id="contact-us"
      className="w-full bg-black px-6 py-12 md:px-[120px] md:py-[68px]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
        {/* Form */}
        <form className="flex w-full flex-col gap-[27px] md:flex-1">
          {fields.map(({ label, placeholder, type }) => (
            <label key={label} className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">{label}</span>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white placeholder-[#666] outline-none"
              />
            </label>
          ))}
          <button
            type="submit"
            className="w-[94px] rounded-[5px] bg-tedx-red py-3 text-[16px] font-bold text-white"
          >
            NEXT
          </button>
        </form>

        {/* Heading */}
        <div className="flex shrink-0 flex-col items-end gap-[10px] text-right md:w-[606px]">
          <h2
            className="font-display leading-none tracking-[-0.04em] text-white"
            style={{
              fontSize: "clamp(3rem, 8.9vw, 128px)",
              textShadow: "0 4px 25px rgba(0,0,0,.35)",
            }}
          >
            READY TO
            <br />
            BUILD YOUR <span className="text-tedx-red">MOMENTUM</span>?
          </h2>
          <p className="text-[16px] text-tedx-red">Register for a Talk</p>
        </div>
      </div>
    </section>
  );
}
