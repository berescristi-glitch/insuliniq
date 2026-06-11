"use client";

// Client shell for the skip path: reads answers from sessionStorage (written by QuizStepper
// when the user taps "Skip"), runs matchProfile in the browser, and renders the results UI.
// This avoids a DB round-trip for users who chose not to provide an email.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { matchProfile } from "@/lib/quiz/matcher";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import type { QuizAnswers } from "@/lib/quiz/types";
import type { MatchResult } from "@/lib/quiz/matcher";

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

// Fallback when sessionStorage is unavailable or the key is missing
function defaultResult(): MatchResult {
  return matchProfile({
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
}

interface Props {
  sessionId: string;
}

export function ResultsSkipShell({ sessionId }: Props) {
  const [result, setResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`quiz_answers_${sessionId}`);
      if (raw) {
        const answers = JSON.parse(raw) as QuizAnswers;
        setResult(matchProfile(answers));
        // Clean up immediately — the key is single-use
        sessionStorage.removeItem(`quiz_answers_${sessionId}`);
      } else {
        setResult(defaultResult());
      }
    } catch {
      setResult(defaultResult());
    }
  }, [sessionId]);

  if (!result) {
    // Loading skeleton — keeps layout stable while hydrating
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 animate-pulse">
        <div className="h-8 bg-forest-100 rounded-full w-32 mx-auto" />
        <div className="h-12 bg-forest-50 rounded-2xl w-3/4 mx-auto" />
        <div className="h-24 bg-muted rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

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

      {/* CTA section */}
      <div
        className={`rounded-2xl border-2 bg-white p-8 text-center space-y-4 ${styles.accent}`}
      >
        <h2 className="text-2xl font-bold text-foreground">
          Start your 14-day metabolic plan
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Personalised meal plans, shopping lists with your local store
          references, and weekly guides built around your profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={result.planHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors ${styles.cta}`}
          >
            Get Your Plan — $19
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-forest-300 hover:bg-forest-50 transition-colors"
          >
            Explore all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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

      {/* Required per CLAUDE.md */}
      <MedicalDisclaimer />
    </div>
  );
}
