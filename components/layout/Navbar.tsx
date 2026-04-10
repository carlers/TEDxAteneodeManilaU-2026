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
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-black"
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
              <RegisterButton />
              <button
                className={`${mobileMenuOpen ? "text-tedx-red" : "text-tedx-red"
                  } inline-flex h-9 w-9 items-center justify-center self-center rounded-md text-tedx-red transition-all duration-300 hover:text-tedx-red sm:h-10 sm:w-10`}
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
        className={`lg:hidden fixed inset-0 z-40 backdrop-blur-xl bg-black/95 transform transition-all duration-500 ease-in-out ${mobileMenuOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0"
          }`}
        style={{ top: "0", height: "100vh" }}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8 pt-16">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`${navUnderlineClass} text-white hover:text-tedx-red px-3 py-4 text-base sm:text-lg font-bold uppercase tracking-[0.18em] transition-all duration-350 transform ${mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
                }`}
              style={{ transitionDelay: "100ms" }}
            >
              HOME
            </span>
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`${navUnderlineClass} text-white hover:text-tedx-red px-3 py-4 text-base sm:text-lg font-bold uppercase tracking-[0.18em] transition-all duration-350 transform ${mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
                }`}
              style={{ transitionDelay: "200ms" }}
            >
              ABOUT
            </span>
          </Link>
          <Link href="/event-details" onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`${navUnderlineClass} text-white hover:text-tedx-red px-3 py-4 text-base sm:text-lg font-bold uppercase tracking-[0.18em] transition-all duration-350 transform ${mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
                }`}
              style={{ transitionDelay: "250ms" }}
            >
              EVENT DETAILS
            </span>
          </Link>
          <Link href="/core-team" onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`${navUnderlineClass} text-white hover:text-tedx-red px-3 py-4 text-base sm:text-lg font-bold uppercase tracking-[0.18em] transition-all duration-350 transform ${mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
                }`}
              style={{ transitionDelay: "300ms" }}
            >
              OUR STORY
            </span>
          </Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
            <span
              className={`${navUnderlineClass} text-white hover:text-tedx-red px-3 py-4 text-base sm:text-lg font-bold uppercase tracking-[0.18em] transition-all duration-350 transform ${mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
                }`}
              style={{ transitionDelay: "400ms" }}
            >
              SHOP
            </span>
          </Link>
          <div
            className={`pt-8 transition-all duration-700 transform ${mobileMenuOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
              }`}
            style={{ transitionDelay: "500ms" }}
          >
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <span className="bg-tedx-red text-white hover:bg-red-600 px-8 py-3 rounded-md text-xl font-medium cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 relative overflow-hidden group">
                <span className="relative z-10">Register Now</span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-red-700 transition-all duration-300 group-hover:h-full -z-0"></span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
