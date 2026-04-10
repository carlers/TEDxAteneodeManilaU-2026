import Reveal from "@/app/components/Reveal";

export default function FaqSection() {
  return (
    <section id="faq" className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        <Reveal variant="fade-up">
          <h2 className="text-4xl font-bold">FAQS</h2>
        </Reveal>
        {/* Content goes here */}
      </div>
    </section>
  );
}
