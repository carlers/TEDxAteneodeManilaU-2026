"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import Reveal from "@/app/components/Reveal";

type ParticipantType = "atenean" | "scholar" | "non_atenean";

export default function ContactUsSection() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolAffiliation, setSchoolAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [participantType, setParticipantType] = useState<ParticipantType>("atenean");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    posthog.capture("contact_form_submitted", { participant_type: participantType });
    const params = new URLSearchParams({
      fullName,
      email,
      contactNumber,
      schoolAffiliation,
      participantType,
    });
    router.push(`/register?${params.toString()}`);
  };

  return (
    <section
      id="contact-us"
      className="w-full bg-black px-6 py-12 md:px-8 md:py-[68px] lg:px-12 xl:px-[120px]"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-start gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-14 xl:gap-16">
        {/* Form */}
        <Reveal variant="fade-right" delay={0.1} className="w-full md:flex-1">
          <form className="flex w-full flex-col gap-[27px]" onSubmit={onSubmit}>
            <label className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">First Name</span>
              <input
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                type="text"
                placeholder="Juan Christian"
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white placeholder:text-tedx-muted-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">Last Name</span>
              <input
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                type="text"
                placeholder="Dela Cruz"
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white placeholder:text-tedx-muted-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">School / Affiliation</span>
              <input
                required
                value={schoolAffiliation}
                onChange={(event) => setSchoolAffiliation(event.target.value)}
                type="text"
                placeholder="Ateneo de Manila University"
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white placeholder:text-tedx-muted-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">Email Address</span>
              <input
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="juandelacruz@student.ateneo.edu"
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white placeholder:text-tedx-muted-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">Contact Number</span>
              <input
                required
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
                type="tel"
                placeholder="0917 123 4567"
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white placeholder:text-tedx-muted-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-[9px]">
              <span className="text-[16px] text-white">Participant Type</span>
              <select
                value={participantType}
                onChange={(event) => setParticipantType(event.target.value as ParticipantType)}
                className="w-full rounded-[10px] bg-tedx-outline-strong px-[23px] py-[17px] text-[12px] text-white outline-none"
              >
                <option value="atenean">AMAn / Atenean / TEDx</option>
                <option value="scholar">Scholar</option>
                <option value="non_atenean">Non-Atenean</option>
              </select>
            </label>
            <button
              type="submit"
              className="w-[94px] rounded-[5px] bg-tedx-red py-3 text-[16px] font-bold text-white"
            >
              NEXT
            </button>
          </form>
        </Reveal>

        {/* Heading */}
        <Reveal variant="fade-left" className="flex w-full shrink-0 flex-col items-start gap-[10px] text-left lg:w-[520px] lg:items-end lg:text-right xl:w-[606px]">
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
          <p className="text-[16px] text-tedx-red">Buy Your Ticket</p>
        </Reveal>
      </div>
    </section>
  );
}
