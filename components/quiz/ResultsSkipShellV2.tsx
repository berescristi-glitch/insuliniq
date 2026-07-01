"use client";

// Skip-path shell for Quiz v2.
// Reads QuizAnswersV2 from sessionStorage, calls matchProfileV2, bridges to ResultsDisplay.
// Key prefix: quiz_v2_answers_{sessionId} — different from v1 to avoid collision.

import { useEffect, useState } from "react";
import { matchProfileV2 } from "@/lib/quiz/matcher-v2";
import { ResultsDisplay } from "@/components/quiz/ResultsDisplay";
import { ResultsConfidenceBadge } from "@/components/quiz/ResultsConfidenceBadge";
import type { QuizAnswersV2 } from "@/lib/quiz/types-v2";
import type { QuizAnswers } from "@/lib/quiz/types";
import type { MatchResult } from "@/lib/quiz/matcher";

// Bridge v2 answers to v1 QuizAnswers for scorer + SafetyNotice compatibility
function bridgeToV1(v2: QuizAnswersV2): QuizAnswers {
  const symptomMap: Partial<Record<string, import("@/lib/quiz/types").Symptom>> = {
    high_blood_sugar:    "high_blood_sugar",
    high_blood_pressure: "high_blood_pressure",
    irregular_periods:   "irregular_periods",
    acne_or_hair_growth: "acne_or_hair_growth",
    dark_skin_patches:   "dark_skin_patches",
    high_triglycerides:  "high_triglycerides",
    energy_crashes:      "energy_crashes",
    post_meal_fatigue:   "energy_crashes",
    family_history:      "family_history_diabetes",
    none:                "none",
    // New v2 symptoms without v1 equivalent are dropped
  };

  const validV1Flags = new Set([
    "type1_diabetes", "pregnant", "breastfeeding", "kidney_disease",
    "advanced_liver_disease", "eating_disorder_history", "takes_insulin",
    "hypoglycemia_risk_medication", "under_18",
  ]);

  return {
    goal:
      v2.goal === "weight_management" ? "belly_fat" :
      v2.goal === null ? null :
      v2.goal as import("@/lib/quiz/types").QuizGoal,
    region: v2.region,
    symptoms: v2.symptoms
      .map((s) => symptomMap[s])
      .filter((s): s is import("@/lib/quiz/types").Symptom => s !== undefined),
    dietPattern: v2.dietPattern,
    allergens: v2.allergens,
    cookingTime: v2.cookingTime,
    cookingSkill: v2.cookingSkill,
    ageRange: v2.ageRange,
    safetyFlags: v2.safetyFlags.filter(
      (f): f is import("@/lib/quiz/types").SafetyFlag => validV1Flags.has(f)
    ),
    email: v2.email,
  };
}

function defaultV2Answers(): QuizAnswersV2 {
  return {
    healthDataConsent: false,
    goal: null,
    region: null,
    ageRange: null,
    biologicalSex: null,
    safetyFlags: [],
    knownConditions: [],
    symptoms: [],
    dietPattern: null,
    allergens: [],
    cookingTime: null,
    cookingSkill: null,
    weeklyBudget: null,
    email: null,
    marketingConsent: false,
  };
}

interface Props {
  sessionId: string;
}

export function ResultsSkipShellV2({ sessionId }: Props) {
  const [v2Answers, setV2Answers] = useState<QuizAnswersV2 | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`quiz_v2_answers_${sessionId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as QuizAnswersV2;
        setV2Answers(parsed);
        sessionStorage.removeItem(`quiz_v2_answers_${sessionId}`);
      } else {
        setV2Answers(defaultV2Answers());
      }
    } catch {
      setV2Answers(defaultV2Answers());
    }
  }, [sessionId]);

  if (!v2Answers) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6 animate-pulse">
        <div className="h-8 bg-forest-100 rounded-full w-32 mx-auto" />
        <div className="h-12 bg-forest-50 rounded-2xl w-3/4 mx-auto" />
        <div className="h-24 bg-muted rounded-2xl" />
      </div>
    );
  }

  const v2Result = matchProfileV2(v2Answers);
  const v1Answers = bridgeToV1(v2Answers);
  const baseResult = v2Result as unknown as MatchResult;

  return (
    <>
      <ResultsConfidenceBadge
        confidence={v2Result.profileConfidence}
        personalizationNote={v2Result.personalizationNote}
      />
      <ResultsDisplay result={baseResult} answers={v1Answers} retakeHref="/quiz-v2" />
    </>
  );
}
