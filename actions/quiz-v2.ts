"use server";

// Server Action: persist Quiz v2 results to Supabase.
// v2 stores quiz_version and profile_confidence in quiz_results.
// Marketing consent logic is identical to v1 (Sprint 3).
// Does NOT modify the v1 submitQuiz action.

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { matchProfileV2 } from "@/lib/quiz/matcher-v2";
import { sendConfirmationEmail } from "@/lib/resend/emails";
import { logQuizEvent } from "@/actions/analytics";
import type { QuizAnswersV2 } from "@/lib/quiz/types-v2";

const QuizV2SubmitSchema = z.object({
  sessionId: z.string().min(1),
  answers: z.record(z.unknown()),
  email: z.string().email().optional(),
  marketingConsent: z.boolean().optional(),
});

export async function submitQuizV2(data: {
  sessionId: string;
  answers: QuizAnswersV2;
  email?: string;
  marketingConsent?: boolean;
}): Promise<{ success: true; profileId: string } | { success: false; error: string }> {
  const parsed = QuizV2SubmitSchema.safeParse({
    ...data,
    answers: data.answers as Record<string, unknown>,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { sessionId, email, marketingConsent } = parsed.data;
  const answers = data.answers;
  const result = matchProfileV2(answers);

  const supabase = await createClient();

  // Non-sensitive validation log (Vercel function logs — no PII, no health data)
  console.log("[quiz-v2]", JSON.stringify({
    quiz_version: "v2",
    matched_profile: result.profile,
    profile_confidence: result.profileConfidence,
    completion_path: email ? "email" : "skip",
    has_safety_flags: answers.safetyFlags.length > 0 && !answers.safetyFlags.every(f => f === "none"),
    marketing_consent: marketingConsent ?? false,
    region: answers.region?.country ?? null,
    ts: new Date().toISOString(),
  }));

  // Insert quiz_results with quiz_version = 'v2' and profile_confidence
  // types/database.ts now includes quiz_version and profile_confidence (Sprint 7 update)
  const { error: quizError } = await supabase.from("quiz_results").insert({
    session_id: sessionId,
    answers: answers as Record<string, unknown>,
    metabolic_profile: result.profile,
    recommendations: result.articles as unknown as Record<string, unknown>[],
    quiz_version: "v2",
    profile_confidence: result.profileConfidence,
  });

  if (quizError) {
    console.error("Quiz v2 insert error:", quizError);
  }

  // Newsletter subscriber — same logic as v1 (Sprint 3 consent gates)
  if (email) {
    const country =
      answers.region?.country === "US" ? "US" :
      answers.region?.country === "UK" ? "GB" :
      answers.region?.country === "AU" ? "AU" : null;

    const region =
      answers.region?.country === "US" ? "US" :
      answers.region?.country === "UK" ? "UK" :
      answers.region?.country === "AU" ? "AU" : null;

    const hasSafetyFlags =
      answers.safetyFlags.length > 0 && !answers.safetyFlags.every((f) => f === "none");

    const now = new Date().toISOString();
    const admin = getAdminClient();

    const { data: existing } = await admin
      .from("newsletter_subscribers")
      .select("id, marketing_consent, confirmed, unsubscribed_at")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Only upgrade consent, never downgrade; never re-subscribe unsubscribed users
      if (marketingConsent && !existing.marketing_consent && !existing.unsubscribed_at) {
        const { error: updateErr } = await admin
          .from("newsletter_subscribers")
          .update({
            marketing_consent: true,
            consent_timestamp: now,
            consent_source: "quiz_v2_step12",
            metabolic_profile: result.profile,
            quiz_goal: answers.goal ?? null,
            region: region ?? null,
            has_safety_flags: hasSafetyFlags,
            updated_at: now,
          })
          .eq("id", existing.id);

        if (!updateErr && !existing.confirmed) {
          sendConfirmationEmail(email).catch((err) =>
            console.error("Quiz v2 confirmation email failed (returning):", err)
          );
        }
      } else {
        // Update profile data even without new consent
        await admin.from("newsletter_subscribers").update({
          metabolic_profile: result.profile,
          quiz_goal: answers.goal ?? null,
          region: region ?? null,
          has_safety_flags: hasSafetyFlags,
          updated_at: now,
        }).eq("id", existing.id);
      }
    } else {
      const { error: insertErr } = await admin.from("newsletter_subscribers").insert({
        email,
        source: "quiz_v2",
        country: country ?? null,
        confirmed: false,
        marketing_consent: marketingConsent ?? false,
        consent_timestamp: marketingConsent ? now : null,
        consent_source: marketingConsent ? "quiz_v2_step12" : null,
        metabolic_profile: result.profile,
        quiz_goal: answers.goal ?? null,
        region: region ?? null,
        has_safety_flags: hasSafetyFlags,
        updated_at: now,
      });

      if (marketingConsent && !insertErr) {
        sendConfirmationEmail(email).catch((err) =>
          console.error("Quiz v2 confirmation email failed (new):", err)
        );
      }
    }
  }

  // Await analytics — server-side only, no UX cost; avoids serverless abandonment.
  // logQuizEvent has internal try/catch so this never throws to the caller.
  const hasSafetyFlagsActive =
    answers.safetyFlags.length > 0 && !answers.safetyFlags.every((f) => f === "none");

  await logQuizEvent(
    {
      quiz_version: "v2",
      event_type: "quiz_completed",
      matched_profile: result.profile,
      profile_confidence: result.profileConfidence,
      completion_path: email ? "email" : "skip",
      marketing_consent: marketingConsent ?? false,
      has_safety_flags: hasSafetyFlagsActive,
      source: "direct",
    },
    sessionId
  );

  return { success: true, profileId: sessionId };
}
