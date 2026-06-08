import { HeroSection } from "@/components/marketing/HeroSection";
import { ConditionHubs } from "@/components/marketing/ConditionHubs";
import { TallyQuizEmbed } from "@/components/marketing/TallyQuizEmbed";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

export const metadata = {
  title: "InsulinIQ — Understand & Improve Your Metabolic Health",
  description:
    "Science-backed education on insulin resistance, PCOS, prediabetes, NAFLD, and metabolic syndrome. Take our free quiz to get your personalized metabolic profile.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ConditionHubs />

      {/* Quiz teaser section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              What&apos;s your metabolic profile?
            </h2>
            <p className="mt-3 text-gray-500">
              Answer 10 quick questions and get a personalized overview of your
              insulin sensitivity. Free, no sign-up required.
            </p>
          </div>
          {/* Replace TALLY_FORM_ID with your actual Tally form ID */}
          <TallyQuizEmbed formId={process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? "TALLY_FORM_ID"} />
        </div>
      </section>

      <NewsletterForm />
    </>
  );
}
