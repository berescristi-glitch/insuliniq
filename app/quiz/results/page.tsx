// Results page — Server Component.
// Reads quiz_results from Supabase if ?session= present.
// If ?skip=1, renders a client shell that reads sessionStorage (same session key).
// All presentational logic lives in ResultsDisplay (shared with ResultsSkipShell).

import type { Metadata } from "next";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { matchProfile } from "@/lib/quiz/matcher";
import { ResultsDisplay } from "@/components/quiz/ResultsDisplay";
import { ResultsSkipShell } from "@/components/quiz/ResultsSkipShell";
import { enrollInNurture } from "@/actions/nurture";
import type { QuizAnswers } from "@/lib/quiz/types";
import type { Database } from "@/types/database";

// Quiz takers are anonymous — quiz_results has no user_id, so the anon/cookie
// client can never satisfy the `auth.uid() = user_id` SELECT policy. session_id
// is a crypto.randomUUID() capability token (set in QuizStepper), so reading
// this one row with the service-role client, scoped strictly to that id, is
// safe — same pattern as actions/nurture.ts and the Lemon Squeezy webhook.
function getAdminClient() {
  return createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const metadata: Metadata = {
  title: "Your Metabolic Profile | InsulinIQ",
  description:
    "Your personalised metabolic health profile based on your quiz answers.",
};

// Default results shown when no session data is available
function GenericResults() {
  const answers: QuizAnswers = {
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
  const result = matchProfile(answers);
  return <ResultsDisplay result={result} answers={answers} />;
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
    const supabase = getAdminClient();
    const { data } = await supabase
      .from("quiz_results")
      .select("answers, metabolic_profile, recommendations")
      .eq("session_id", session)
      .maybeSingle();

    if (data?.answers) {
      // answers is Json from DB — cast via unknown to QuizAnswers
      const answers = data.answers as unknown as QuizAnswers;
      const result = matchProfile(answers);

      // Enroll in nurture if email present AND user gave marketing consent.
      // enrollInNurture checks marketing_consent + unsubscribed_at internally.
      // Idempotent — safe to call on every page load.
      if (answers.email) {
        await enrollInNurture(answers.email, {
          metabolicProfile: result.profile,
          goal: answers.goal ?? undefined,
          region: answers.region?.country ?? undefined,
        });
      }

      return <ResultsDisplay result={result} answers={answers} />;
    }
  }

  // Fallback: no session or DB miss — show generic wellness profile
  return <GenericResults />;
}
