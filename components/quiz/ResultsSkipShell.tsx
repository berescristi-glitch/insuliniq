"use client";

// Client shell for the skip path: reads answers from sessionStorage (written by QuizStepper
// when the user taps "Skip"), runs matchProfile in the browser, and renders the shared
// ResultsDisplay UI — the same component the DB-backed session path uses, so pricing and
// copy never drift between the two paths.

import { useEffect, useState } from "react";
import { matchProfile } from "@/lib/quiz/matcher";
import { ResultsDisplay } from "@/components/quiz/ResultsDisplay";
import type { QuizAnswers } from "@/lib/quiz/types";

// Fallback when sessionStorage is unavailable or the key is missing
function defaultAnswers(): QuizAnswers {
  return {
    goal: null,
    region: null,
    symptoms: [],
    dietPattern: null,
    allergens: [],
    cookingTime: null,
    cookingSkill: null,
    ageRange: null,
    safetyFlags: [],
    email: null,
  };
}

interface Props {
  sessionId: string;
}

export function ResultsSkipShell({ sessionId }: Props) {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`quiz_answers_${sessionId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as QuizAnswers;
        setAnswers(parsed);
        // Clean up immediately — the key is single-use
        sessionStorage.removeItem(`quiz_answers_${sessionId}`);
      } else {
        setAnswers(defaultAnswers());
      }
    } catch {
      setAnswers(defaultAnswers());
    }
  }, [sessionId]);

  if (!answers) {
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

  const result = matchProfile(answers);
  return <ResultsDisplay result={result} answers={answers} />;
}
