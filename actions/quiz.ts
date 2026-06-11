"use server";

// Server Action: persist quiz results to Supabase.
// Uses anon client — RLS on quiz_results must allow anonymous INSERT (session_id keyed).
// Newsletter upsert uses onConflict to silently handle returning subscribers.

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { matchProfile } from "@/lib/quiz/matcher";
import type { QuizAnswers } from "@/lib/quiz/types";

// We validate the envelope shape; deep answer validation happens via TypeScript at call site.
// z.unknown() is intentional here — the answers object is already typed via QuizAnswers at the
// TypeScript level; we avoid a full Zod re-schema of the union types to prevent drift.
const QuizSubmitSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  // answers are validated structurally by TypeScript; we just ensure it's an object
  answers: z.record(z.unknown()),
  email: z.string().email("Please enter a valid email address").optional(),
});

export async function submitQuiz(data: {
  sessionId: string;
  answers: QuizAnswers;
  email?: string;
}): Promise<{ success: true; profileId: string } | { success: false; error: string }> {
  // Cast answers to Record for Zod envelope check while keeping QuizAnswers type above
  const parsed = QuizSubmitSchema.safeParse({
    ...data,
    answers: data.answers as Record<string, unknown>,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { sessionId, email } = parsed.data;
  const answers = data.answers; // typed QuizAnswers, validated at compile time
  const match = matchProfile(answers);

  const supabase = await createClient();

  // Insert quiz result — no .select().single() per CLAUDE.md to avoid never[] type error
  const { error: quizError } = await supabase.from("quiz_results").insert({
    session_id: sessionId,
    answers: answers as Record<string, unknown>,
    metabolic_profile: match.profile,
    recommendations: match.articles as unknown as Record<string, unknown>[],
  });

  if (quizError) {
    console.error("Quiz insert error:", quizError);
    // Don't block the user from seeing results if DB write fails
  }

  // Optionally capture email in newsletter_subscribers
  if (email) {
    const country =
      answers.region?.country === "US"
        ? "US"
        : answers.region?.country === "UK"
          ? "GB"
          : answers.region?.country === "AU"
            ? "AU"
            : null;

    const { error: subError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, source: "quiz", country, confirmed: false },
        { onConflict: "email" }
      );

    if (subError) {
      // Non-fatal: log but don't surface to user
      console.error("Newsletter upsert error:", subError);
    }
  }

  return { success: true, profileId: sessionId };
}
