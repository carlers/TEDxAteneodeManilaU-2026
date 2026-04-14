/**
 * Home Page - TEDxAteneodeManilaU
 * 
 * Main landing page for the TEDxAteneodeManilaU website.
 * Features hero section with event theme, countdown timer, featured speakers,
 * and calls-to-action for registration and exploration.
 * 
 * @route /
 */
import {
  AgendaSection,
  ContactUsSection,
  FaqSection,
  LandingSection,
  SpeakersSection,
  SponsorsSection,
  TalksSection,
  VenueSection,
  WhatIsMomentumSection,
  WhatIsTedxSection,
} from "@/app/(home)/sections";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-black font-sans text-tedx-white">
      <LandingSection />
      <WhatIsMomentumSection />
      <WhatIsTedxSection />
      <TalksSection />
      <SpeakersSection />
      <AgendaSection />
      <VenueSection />
      <SponsorsSection />
      <FaqSection />
      <ContactUsSection />
    </div>
  );
}
