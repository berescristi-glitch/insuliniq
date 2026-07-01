// Quiz v2 results page — /quiz-v2/results
// Reads from DB (session param) or sessionStorage (skip=1 param).
// Bridges v2 answers to v1-compatible format for ResultsDisplay.
// Shows v2-specific confidence badge above the main results.
// Does NOT modify /quiz/results.

import type { Metadata } from "next";
import { getAdminClient } from "@/lib/supabase/admin";
import { matchProfileV2 } from "@/lib/quiz/matcher-v2";
import { ResultsDisplay } from "@/components/quiz/ResultsDisplay";
import { ResultsSkipShellV2 } from "@/components/quiz/ResultsSkipShellV2";
import { ResultsConfidenceBadge } from "@/components/quiz/ResultsConfidenceBadge";
import { enrollInNurture } from "@/actions/nurture";
import { logQuizEvent } from "@/actions/analytics";
import type { QuizAnswersV2 } from "@/lib/quiz/types-v2";
import type { QuizAnswers } from "@/lib/quiz/types";
import type { MatchResult } from "@/lib/quiz/matcher";

export const metadata: Metadata = {
  title: "Your Metabolic Profile v2 | InsulinIQ",
  description: "Your personalised educational metabolic profile based on your quiz answers.",
  robots: { index: false, follow: false },
};

// Bridge v2 answers to v1-compatible QuizAnswers for scorer + SafetyNotice
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

// ConfidenceBadge is now a shared component imported above.

// Default generic v2 answers (fallback with no session)
function defaultV2(): QuizAnswersV2 {
  return {
    healthDataConsent: false, goal: null, region: null, ageRange: null,
    biologicalSex: null, safetyFlags: [], knownConditions: [], symptoms: [],
    dietPattern: null, allergens: [], cookingTime: null, cookingSkill: null,
    weeklyBudget: null, email: null, marketingConsent: false,
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QuizV2ResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = typeof params.session === "string" ? params.session : null;
  const isSkip  = params.skip === "1";

  // Skip path: client reads sessionStorage
  if (isSkip && session) {
    return <ResultsSkipShellV2 sessionId={session} />;
  }

  // Session path: read from DB
  if (session) {
    const supabase = getAdminClient();
    const { data, error: dbError } = await supabase
      .from("quiz_results")
      .select("answers, metabolic_profile, recommendations")
      .eq("session_id", session)
      .maybeSingle();

    if (dbError) {
      // Likely cause: SUPABASE_SERVICE_ROLE_KEY missing or contains BOM character in Vercel env vars.
      console.error("[quiz-v2/results] DB read failed for session", session, ":", dbError.message);
    }

    if (data?.answers) {
      const v2Answers = data.answers as unknown as QuizAnswersV2;
      const v2Result = matchProfileV2(v2Answers);
      const v1Answers = bridgeToV1(v2Answers);

      if (v2Answers.email) {
        await enrollInNurture(v2Answers.email, {
          metabolicProfile: v2Result.profile,
          goal: v2Answers.goal ?? undefined,
          region: v2Answers.region?.country ?? undefined,
        });
      }

      const baseResult = v2Result as unknown as MatchResult;

      // Log results_viewed event — fire-and-forget, never blocks render
      logQuizEvent({
        quiz_version: "v2",
        event_type: "results_viewed",
        matched_profile: v2Result.profile,
        profile_confidence: v2Result.profileConfidence,
        completion_path: "email",
        has_safety_flags: v2Answers.safetyFlags.length > 0 && !v2Answers.safetyFlags.every(f => f === "none"),
        source: "direct",
      }, session).catch(() => {});

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
  }

  // Fallback — no session (or admin client failed to read row)
  const fallbackV2 = defaultV2();
  const fallbackV2Result = matchProfileV2(fallbackV2);
  const fallbackV1 = bridgeToV1(fallbackV2);

  return (
    <>
      <ResultsConfidenceBadge confidence="low" />
      <ResultsDisplay result={fallbackV2Result as unknown as MatchResult} answers={fallbackV1} retakeHref="/quiz-v2" />
    </>
  );
}
