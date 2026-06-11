import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AnnouncementBanner } from "@/components/marketing/AnnouncementBanner";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SocialProofStrip } from "@/components/marketing/SocialProofStrip";
import { StatsSection } from "@/components/marketing/StatsSection";
import { BeforeAfterSection } from "@/components/marketing/BeforeAfterSection";
import { BentoGrid } from "@/components/marketing/BentoGrid";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { FeaturedArticles } from "@/components/marketing/FeaturedArticles";
import { TestimonialSection } from "@/components/marketing/TestimonialSection";
import { QuizCTASection } from "@/components/marketing/QuizCTASection";
import { FinalCTASection } from "@/components/marketing/FinalCTASection";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

export const metadata = {
  title: "InsulinIQ — Understand & Improve Your Metabolic Health",
  description:
    "Science-backed education on insulin resistance, PCOS, prediabetes, NAFLD, and metabolic syndrome. Take our free quiz to get your personalized metabolic profile.",
};

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <SiteHeader />
      <main>
        <HeroSection />
        <SocialProofStrip />
        <StatsSection />
        <BeforeAfterSection />
        <BentoGrid />
        <HowItWorksSection />
        <FeaturedArticles />
        <TestimonialSection />
        <QuizCTASection />
        <FinalCTASection />
        <NewsletterForm />
      </main>
      <SiteFooter />
    </>
  );
}
