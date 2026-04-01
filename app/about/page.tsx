/**
 * About Page - What is TEDx?
 * 
 * Educational page explaining the TEDx program, its relationship to TED,
 * and the mission of TEDxAteneodeManilaU. Includes history, license details,
 * and the event's purpose within the Ateneo de Manila University community.
 * 
 * @route /about
 */
import {
  AboutTedTedxSection,
  AboutTedxAteneoSection,
  GetInvolvedSection,
  LandingSection,
  LegacySection,
  MissionVisionSection,
  PastMomentsSection,
  PastTalksSection,
  SpeakerTestimonialSection,
} from "@/app/about/sections";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-tedx-black font-sans text-tedx-white">
      <LandingSection />
      <AboutTedTedxSection />
      <AboutTedxAteneoSection />
      <MissionVisionSection />
      <LegacySection />
      <PastMomentsSection />
      <PastTalksSection />
      <SpeakerTestimonialSection />
      <GetInvolvedSection />
    </div>
  );
}
