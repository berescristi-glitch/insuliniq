// Results page — Server Component.
// Reads quiz_results from Supabase if ?session= present.
// If ?skip=1, renders a client shell that reads sessionStorage (same session key).
// MedicalDisclaimer is required here per CLAUDE.md.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { matchProfile } from "@/lib/quiz/matcher";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { ResultsSkipShell } from "@/components/quiz/ResultsSkipShell";
import type { QuizAnswers } from "@/lib/quiz/types";
import type { MatchResult } from "@/lib/quiz/matcher";

export const metadata: Metadata = {
  title: "Your Metabolic Profile | InsulinIQ",
  description:
    "Your personalised metabolic health profile based on your quiz answers.",
};

// Tailwind classes per profile color — must be complete strings (no dynamic construction)
// because Tailwind purges dynamic class fragments.
const profileStyles = {
  forest: {
    badge: "bg-forest-100 text-forest-700 border-forest-200",
    heading: "text-forest-800",
    accent: "border-forest-400",
    cta: "bg-forest-600 hover:bg-forest-700 shadow-forest-600/20",
    cardBorder: "border-forest-100",
    categoryBadge: "bg-forest-50 text-forest-700 border-forest-200",
  },
  sage: {
    badge: "bg-sage-100 text-sage-700 border-sage-200",
    heading: "text-sage-800",
    accent: "border-sage-400",
    cta: "bg-sage-600 hover:bg-sage-700 shadow-sage-600/20",
    cardBorder: "border-sage-100",
    categoryBadge: "bg-sage-50 text-sage-700 border-sage-200",
  },
  clay: {
    badge: "bg-clay-100 text-clay-700 border-clay-200",
    heading: "text-clay-800",
    accent: "border-clay-400",
    cta: "bg-clay-600 hover:bg-clay-700 shadow-clay-600/20",
    cardBorder: "border-clay-100",
    categoryBadge: "bg-clay-50 text-clay-700 border-clay-200",
  },
  honey: {
    badge: "bg-honey-100 text-honey-700 border-honey-200",
    heading: "text-honey-800",
    accent: "border-honey-400",
    cta: "bg-honey-600 hover:bg-honey-700 shadow-honey-600/20",
    cardBorder: "border-honey-100",
    categoryBadge: "bg-honey-50 text-honey-700 border-honey-200",
  },
} as const;

function ResultsContent({ result }: { result: MatchResult }) {
  const styles = profileStyles[result.profileColor];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Profile hero */}
      <div className="mb-10 text-center space-y-4">
        <span
          className={`inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${styles.badge}`}
        >
          Your profile
        </span>
        <h1
          className={`text-3xl sm:text-4xl font-bold leading-tight ${styles.heading}`}
        >
          {result.profileLabel}
        </h1>
        <p className="max-w-prose mx-auto text-base text-muted-foreground leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* Article recommendations */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-5">
          Your matched articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {result.articles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className={`group block rounded-xl border-2 bg-white p-5 transition-all hover:shadow-md ${styles.cardBorder}`}
            >
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium mb-3 ${styles.categoryBadge}`}
              >
                {article.category}
              </span>
              <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-forest-700 transition-colors">
                {article.title}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-forest-600 transition-colors">
                Read article
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA section — post-quiz upsell */}
      <div
        className={`rounded-2xl border-2 bg-white p-8 text-center space-y-4 ${styles.accent}`}
      >
        <h2 className="text-2xl font-bold text-foreground">
          Unlock your personalised resources
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Get your condition-specific Starter Kit now, or unlock everything
          with a Core Membership.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Primary: tripwire — filled button uses the profile's CTA colour */}
          <Link
            href="/pricing"
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors ${styles.cta}`}
          >
            $27 One-Time · Instant Access
            <ArrowRight className="h-4 w-4" />
          </Link>
          {/* Secondary: membership — outlined */}
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-forest-300 hover:bg-forest-50 transition-colors"
          >
            $29/month · Full Access
          </Link>
        </div>
        {/* Micro-disclaimer — required to prevent medical interpretation */}
        <p className="text-xs text-muted-foreground">
          Educational tools only. Not medical advice. Cancel anytime.
        </p>
      </div>

      {/* Retake link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Not quite right?{" "}
        <Link
          href="/quiz"
          className="font-medium text-forest-600 hover:text-forest-700 underline underline-offset-2"
        >
          Retake the quiz
        </Link>
      </p>

      {/* Required per CLAUDE.md — results contain condition-linked health information */}
      <MedicalDisclaimer />
    </div>
  );
}

// Default results shown when no session data is available
function GenericResults() {
  const result = matchProfile({
    goal: null,
    region: null,
    symptoms: [],
    dietPattern: null,
    allergens: [],
    cookingTime: null,
    cookingSkill: null,
    ageRange: null,
    email: null,
  });
  return <ResultsContent result={result} />;
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QuizResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = typeof params.session === "string" ? params.session : null;
  const isSkip = params.skip === "1";

  // Skip path: client shell reads sessionStorage to decode answers, then renders results
  if (isSkip && session) {
    return <ResultsSkipShell sessionId={session} />;
  }

  // Session path: read from DB
  if (session) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("quiz_results")
      .select("answers, metabolic_profile, recommendations")
      .eq("session_id", session)
      .maybeSingle();

    if (data?.answers) {
      // answers is Json from DB — cast via unknown to QuizAnswers
      const answers = data.answers as unknown as QuizAnswers;
      const result = matchProfile(answers);
      return <ResultsContent result={result} />;
    }
  }

  // Fallback: no session or DB miss — show generic wellness profile
  return <GenericResults />;
}
