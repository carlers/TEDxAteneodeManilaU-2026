"use client";

import Image from "next/image";
import { useState } from "react";
import departmentData from "@/public/team/departments/team-members.json";

type CommitteeId = "logistics" | "adcomm" | "programs" | "pexp";

type CommitteeMember = {
  name: string;
  role: string;
  imageSrc?: string | null;
};

type Committee = {
  id: CommitteeId;
  label: string;
  members: CommitteeMember[];
};

const committees = departmentData.committees as Committee[];
const committeeTabs: Array<Pick<Committee, "id" | "label">> = committees.map(
  (committee) => ({
    id: committee.id,
    label: committee.label,
  }),
);
const showMemberPhotos = false;

const crossBladeStyle = {
  backgroundImage: "var(--tedx-legacy-x-gradient)",
  filter: "drop-shadow(0 0 24px var(--tedx-accent-glow-shadow-soft))",
} as const;

function CrossMark({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      <span
        className="absolute left-1/2 top-1/2 h-[30%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[6px]"
        style={{
          ...crossBladeStyle,
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-[30%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[6px]"
        style={{
          ...crossBladeStyle,
          transform: "translate(-50%, -50%) rotate(-45deg)",
        }}
      />
    </div>
  );
}

function DepartmentCard({
  member,
  featured,
}: {
  member: CommitteeMember;
  featured?: boolean;
}) {
  return (
    <article className="relative flex w-full max-w-[224px] flex-col items-start gap-4 px-1 text-left sm:max-w-[238px]">
      <div className="relative flex w-full items-start justify-center pt-2">
        <CrossMark className="h-[132px] w-[132px] sm:h-[148px] sm:w-[148px]" />

        {featured && showMemberPhotos && member.imageSrc ? (
          <div className="absolute left-0 top-0 h-11 w-11 overflow-hidden rounded-full border-2 border-tedx-white bg-tedx-black shadow-[0_10px_20px_rgba(0,0,0,0.35)] sm:h-12 sm:w-12">
            <Image
              src={member.imageSrc}
              alt={`${member.name} portrait`}
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}
      </div>

      <div className="border-l-4 border-tedx-red pl-3">
        <h3 className="text-[18px] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-tedx-white sm:text-[19px]">
          {member.name}
        </h3>
        <p className="mt-1 text-[14px] leading-[1.05] tracking-[-0.01em] text-tedx-white/78 sm:text-[15px]">
          {member.role}
        </p>
      </div>
    </article>
  );
}

export default function DepartmentsSection() {
  const [activeCommitteeId, setActiveCommitteeId] = useState<CommitteeId>("logistics");

  const activeCommittee =
    committees.find((committee) => committee.id === activeCommitteeId) ?? committees[0];

  return (
    <section
      id="departments"
      aria-labelledby="departments-heading"
      className="relative w-full overflow-hidden bg-tedx-black px-4 py-16 text-tedx-white sm:px-6 lg:px-0 lg:py-[88px] lg:mb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-70px] top-[124px] hidden lg:block"
      >
        <CrossMark className="h-[250px] w-[250px] opacity-35 xl:h-[320px] xl:w-[320px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mx-auto max-w-[780px] text-center">
          <h2
            id="departments-heading"
            className="font-league-gothic tedx-section-heading-shadow text-[4.1rem] leading-[0.82] tracking-[-0.03em] text-tedx-white sm:text-[5.5rem] lg:text-[122px] lg:leading-none"
          >
            THE DEPARTMENTS
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[18px] leading-[1.25] text-tedx-muted-text">
            Our committees shape every part of the TEDxAteneodeManilaU experience, from
            logistics and audience engagement to program curation and partner
            execution. Select a department to meet the team behind the work.
          </p>
        </div>

        <div
          role="navigation"
          aria-label="Department committees"
          className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 lg:mt-14"
        >
          {committeeTabs.map((tab) => {
            const isActive = tab.id === activeCommitteeId;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCommitteeId(tab.id)}
                aria-pressed={isActive}
                className={`min-w-[112px] rounded-[4px] border px-4 py-2 text-[14px] font-bold uppercase tracking-[-0.02em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-white focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black sm:min-w-[128px] sm:text-[15px] ${isActive
                  ? "border-tedx-red bg-tedx-red text-tedx-white"
                  : "border-tedx-white/14 bg-tedx-white/4 text-tedx-white/88 hover:border-tedx-white/28 hover:bg-tedx-white/8"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 justify-items-center gap-x-4 gap-y-12 sm:grid-cols-2 lg:mt-[64px] lg:grid-cols-3 xl:grid-cols-6">
          {activeCommittee.members.map((member, index) => (
            <DepartmentCard
              key={`${activeCommittee.id}-${member.name}-${index}`}
              member={member}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
