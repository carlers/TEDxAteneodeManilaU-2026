import Link from "next/link";

const contactEmail = "tedxateneodemanila2526@gmail.com";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/tedxateneodemanilau/",
    icon: (
      <path d="M12 2c2.715 0 3.056.01 4.122.058 1.065.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.362.465 2.427.048 1.066.058 1.407.058 4.122s-.01 3.056-.058 4.122c-.049 1.065-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.362.416-2.427.465-1.066.048-1.407.058-4.122.058s-3.056-.01-4.122-.058c-1.065-.049-1.791-.218-2.427-.465a5.098 5.098 0 01-2.925-2.925c-.247-.636-.416-1.362-.465-2.427C2.01 15.056 2 14.715 2 12s.01-3.056.058-4.122c.049-1.065.218-1.791.465-2.427A4.902 4.902 0 013.676 3.68a4.902 4.902 0 011.772-1.153c.636-.247 1.362-.416 2.427-.465C8.944 2.01 9.285 2 12 2zm0 1.8c-2.67 0-2.997.01-4.04.057-.964.044-1.488.205-1.837.341a3.3 3.3 0 00-1.19.774 3.3 3.3 0 00-.774 1.19c-.136.349-.297.873-.341 1.837C3.81 9.043 3.8 9.37 3.8 12c0 2.63.01 2.957.057 4 .044.964.205 1.488.341 1.837.173.45.43.857.774 1.19.333.345.74.602 1.19.774.349.136.873.297 1.837.341 1.043.047 1.37.057 4 .057 2.63 0 2.957-.01 4-.057.964-.044 1.488-.205 1.837-.341.45-.173.857-.43 1.19-.774.345-.333.602-.74.774-1.19.136-.349.297-.873.341-1.837.047-1.043.057-1.37.057-4 0-2.63-.01-2.957-.057-4-.044-.964-.205-1.488-.341-1.837a3.3 3.3 0 00-.774-1.19 3.3 3.3 0 00-1.19-.774c-.349-.136-.873-.297-1.837-.341C14.957 3.81 14.63 3.8 12 3.8zm0 4.4a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6zm0 1.8a2 2 0 100 4 2 2 0 000-4zm4.84-2.57a.89.89 0 110 1.78.89.89 0 010-1.78z" />
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61567127361598",
    icon: (
      <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.76-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tedxateneodemanilau",
    icon: (
      <path d="M19 3A2 2 0 0121 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9.5 6.5H7V17h2.5V9.5zM8.25 7a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88zM17 12.2c0-2.1-1.12-3.08-2.61-3.08-1.2 0-1.74.66-2.04 1.12V9.5H9.9V17h2.45v-3.72c0-.98.19-1.92 1.4-1.92 1.2 0 1.22 1.12 1.22 1.98V17H17v-4.8z" />
    ),
  },
];

export default function GetInTouchSection() {
  return (
    <section
      id="get-in-touch"
      aria-labelledby="get-in-touch-heading"
      className="relative w-full overflow-hidden bg-tedx-black px-4 py-20 text-tedx-white sm:px-6 lg:px-0 lg:py-[110px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[15vw] min-w-[72px] max-w-[240px] bg-gradient-to-r from-tedx-accent-shadow via-tedx-black to-transparent opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[15vw] min-w-[72px] max-w-[240px] bg-gradient-to-l from-tedx-accent-shadow via-tedx-black to-transparent opacity-90"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <h2
          id="get-in-touch-heading"
          className="text-center text-[2.2rem] font-bold tracking-[-0.03em] text-tedx-white sm:text-[3rem] lg:text-[78px]"
        >
          Get in Touch
        </h2>

        <div className="mx-auto mt-12 grid w-full max-w-[1080px] grid-cols-1 gap-12 text-center md:mt-14 md:grid-cols-2 md:gap-16 lg:mt-[84px]">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[1.9rem] font-bold leading-none tracking-[-0.03em] text-tedx-white sm:text-[2.25rem] lg:text-[36px]">
              <span className="text-tedx-red">Contact</span> Us
            </h3>
            <p className="mt-6 text-[1rem] leading-none text-tedx-white/90 sm:mt-8 sm:text-[1.25rem] lg:text-[20px]">
              Email us at:
            </p>
            <Link
              href={`mailto:${contactEmail}`}
              className="mt-5 break-all text-[1.05rem] leading-[1.25] text-tedx-white transition-colors duration-200 hover:text-tedx-muted-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-white focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black sm:mt-6 sm:text-[1.35rem] sm:leading-[1.15] lg:text-[23px]"
            >
              {contactEmail}
            </Link>
          </div>

          <div className="flex flex-col items-center text-center">
            <h3 className="text-[1.9rem] font-bold leading-none tracking-[-0.03em] text-tedx-white sm:text-[2.25rem] lg:text-[36px]">
              <span className="text-tedx-red">Connect</span> with Us
            </h3>
            <p className="mt-6 text-[1rem] leading-none text-tedx-white/90 sm:mt-8 sm:text-[1.25rem] lg:text-[20px]">
              Follow us on our socials:
            </p>

            <ul className="mt-8 flex items-center justify-center gap-5" aria-label="Social media links">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit TEDxAteneodeManilaU on ${social.label}`}
                    className="text-tedx-white transition-colors duration-200 hover:text-tedx-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-white focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-6 w-6"
                    >
                      {social.icon}
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
