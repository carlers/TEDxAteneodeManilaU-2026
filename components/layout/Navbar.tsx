/**
 * Global Navigation Bar
 * 
 * Persistent header navigation with TEDx logo, page links, and mobile menu.
 * Should be responsive and appear on all pages except potentially admin areas.
 * 
 * @component
 */

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import RegisterButton from "../ui/RegisterButton";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [eventDetailsDropdownOpen, setEventDetailsDropdownOpen] =
    useState(false);
  const navRef = useRef(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const eventDetailsMenuRef = useRef<HTMLDivElement>(null);

  const navUnderlineClass =
    "nav-link-underline relative inline-block cursor-pointer";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aboutMenuRef.current &&
        !aboutMenuRef.current.contains(event.target as Node)
      ) {
        setAboutDropdownOpen(false);
      }

      if (
        eventDetailsMenuRef.current &&
        !eventDetailsMenuRef.current.contains(event.target as Node)
      ) {
        setEventDetailsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg"
          : "bg-black"
          } p-4`}
      >
        <div className="mx-auto w-full px-0 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between gap-3 py-1 text-sm font-bold text-white xl:text-base lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
            <div className="flex-shrink-0 lg:justify-self-start">
              <Link href="/">
                <div className="relative w-32 min-[360px]:w-36 sm:w-44 xl:w-56">
                  <Image
                    src="/TEDxADMU-LOGO.png"
                    alt="TEDx"
                    width={200}
                    height={100}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className="hidden lg:block lg:justify-self-center">
              <div className="flex items-baseline justify-center gap-8 text-sm font-bold text-white xl:text-base">
                <Link href="/">
                  <span
                    className={`${navUnderlineClass} mx-3 py-2 rounded-md transition duration-300`}
                  >
                    HOME
                  </span>
                </Link>

                {/* About Dropdown */}
                <div
                  className="relative"
                  ref={aboutMenuRef}
                  onMouseEnter={() => setAboutDropdownOpen(true)}
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                >
                  <div
                    className="py-2 rounded-md transition duration-300 flex items-center gap-1"
                    onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                  >
                    <Link
                      href="/about"
                      onClick={() => setAboutDropdownOpen(false)}
                    >
                      <span
                        className={`${navUnderlineClass} mx-3 py-2 rounded-md transition duration-300`}
                      >
                        ABOUT
                      </span>
                    </Link>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-tedx-red transition-transform duration-300 ${aboutDropdownOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 pt-2 w-44 rounded-md shadow-lg bg-black/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 font-medium transition-all duration-300 ${aboutDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    <div className="py-1">
                      <Link
                        href="/about#legacy"
                        onClick={() => setAboutDropdownOpen(false)}
                      >
                        <span className="block px-4 py-3 hover:text-tedx-red transition duration-300">
                          LEGACY
                        </span>
                      </Link>
                      <Link
                        href="/about#past-talks"
                        onClick={() => setAboutDropdownOpen(false)}
                      >
                        <span className="block px-4 py-3 hover:text-tedx-red transition duration-300">
                          PAST TALKS
                        </span>
                      </Link>
                      <Link
                        href="/about#get-involved"
                        onClick={() => setAboutDropdownOpen(false)}
                      >
                        <span className="block px-4 py-3 hover:text-tedx-red transition duration-300">
                          GET INVOLVED
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Event Details Dropdown */}
                <div
                  className="relative"
                  ref={eventDetailsMenuRef}
                  onMouseEnter={() => setEventDetailsDropdownOpen(true)}
                  onMouseLeave={() => setEventDetailsDropdownOpen(false)}
                >
                  <div
                    className="py-2 rounded-md transition duration-300 flex items-center gap-1"
                    onClick={() =>
                      setEventDetailsDropdownOpen(!eventDetailsDropdownOpen)
                    }
                  >
                    <Link
                      href="/#talks"
                      onClick={() => setEventDetailsDropdownOpen(false)}
                    >
                      <span
                        className={`${navUnderlineClass} mx-3 py-2 rounded-md transition duration-300`}
                      >
                        EVENT DETAILS
                      </span>
                    </Link>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-tedx-red transition-transform duration-300 ${eventDetailsDropdownOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 pt-2 w-44 rounded-md shadow-lg bg-black/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 font-medium transition-all duration-300 ${eventDetailsDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    <div className="py-1">
                      <Link
                        href="/#speakers"
                        onClick={() => setEventDetailsDropdownOpen(false)}
                      >
                        <span className="block px-4 py-3 hover:text-tedx-red transition duration-300">
                          SPEAKERS
                        </span>
                      </Link>
                      <Link
                        href="/#agenda"
                        onClick={() => setEventDetailsDropdownOpen(false)}
                      >
                        <span className="block px-4 py-3 hover:text-tedx-red transition duration-300">
                          AGENDA
                        </span>
                      </Link>
                      <Link
                        href="/#sponsors"
                        onClick={() => setEventDetailsDropdownOpen(false)}
                      >
                        <span className="block px-4 py-3 hover:text-tedx-red transition duration-300">
                          SPONSORS
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>


                <Link href="/shop">
                  <span
                    className={`${navUnderlineClass} mx-3 py-2 rounded-md transition duration-300`}
                  >
                    MERCH
                  </span>
                </Link>
                <Link href="/team">
                  <span
                    className={`${navUnderlineClass} mx-3 py-2 rounded-md transition duration-300`}
                  >
                    TEAM
                  </span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex lg:justify-self-end">
              <RegisterButton />
            </div>

            <div className="flex shrink-0 items-center gap-2 self-center sm:gap-3 lg:hidden">
              <button
                className={`inline-flex h-10 w-10 items-center justify-center self-center rounded-full border border-tedx-outline-strong bg-black/70 text-tedx-red transition-all duration-300 hover:border-tedx-red sm:h-11 sm:w-11`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileMenuOpen ? "rotate-45 top-2" : "rotate-0 top-0"
                      }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100 top-2"
                      }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 top-2" : "rotate-0 top-4"
                      }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 top-[76px] z-[45] bg-black transform transition-all duration-500 ease-in-out ${mobileMenuOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0 pointer-events-none"
          }`}
      >
        <div className="mx-auto flex h-full w-full max-w-md flex-col overflow-y-auto px-8 pb-8 pt-8">
          <div className="mt-14 flex flex-col gap-2">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/#talks", label: "Event Details" },
              { href: "/shop", label: "Merch" },
              { href: "/team", label: "Team" },
            ].map((item, index) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <span
                  className={`group block w-fit py-1 font-sans text-[42px] font-bold leading-[0.98] tracking-[-0.02em] text-white transition-all duration-300 hover:text-tedx-red ${mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                    }`}
                  style={{ transitionDelay: `${120 + index * 65}ms` }}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {item.label}
                    <span className="h-px w-0 bg-tedx-red transition-all duration-300 group-hover:w-8" />
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div
            className={`mt-auto pt-10 transition-all duration-500 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            style={{ transitionDelay: "520ms" }}
          >
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <span className="inline-flex w-full items-center justify-center rounded-xl border border-tedx-red bg-tedx-red px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(216,45,51,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-tedx-accent-hover hover:shadow-[0_14px_34px_rgba(216,45,51,0.55)]">
                Register Now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
