"use server";

// Server Action: persist quiz results to Supabase.
// Sprint 3: added marketingConsent param — email is ONLY enrolled in marketing
// nurture if user explicitly checks the consent checkbox at Step 9.
// Transactional use of email (saving results, account auth) does not require
// marketing consent; only the nurture/newsletter sequence does.

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { matchProfile } from "@/lib/quiz/matcher";
import { sendConfirmationEmail } from "@/lib/resend/emails";
import type { QuizAnswers } from "@/lib/quiz/types";

const QuizSubmitSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  answers: z.record(z.unknown()),
  email: z.string().email("Please enter a valid email address").optional(),
  marketingConsent: z.boolean().optional(),
});

export async function submitQuiz(data: {
  sessionId: string;
  answers: QuizAnswers;
  email?: string;
  marketingConsent?: boolean;
}): Promise<{ success: true; profileId: string } | { success: false; error: string }> {
  const parsed = QuizSubmitSchema.safeParse({
    ...data,
    answers: data.answers as Record<string, unknown>,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { sessionId, email, marketingConsent } = parsed.data;
  const answers = data.answers;
  const match = matchProfile(answers);

  const supabase = await createClient();

  // 1. Save quiz result
  const { error: quizError } = await supabase.from("quiz_results").insert({
    session_id: sessionId,
    answers: answers as Record<string, unknown>,
    metabolic_profile: match.profile,
    recommendations: match.articles as unknown as Record<string, unknown>[],
  });

  if (quizError) {
    console.error("Quiz insert error:", quizError);
  }

  // 2. Save subscriber record when email is provided.
  //    We always save with the email for transactional purposes (e.g. future
  //    "resend your results" feature), but we only enroll in marketing/nurture
  //    if marketingConsent is explicitly true.
  if (email) {
    const country =
      answers.region?.country === "US" ? "US" :
      answers.region?.country === "UK" ? "GB" :
      answers.region?.country === "AU" ? "AU" : null;

    const region =
      answers.region?.country === "US" ? "US" :
      answers.region?.country === "UK" ? "UK" :
      answers.region?.country === "AU" ? "AU" : null;

    const hasSafetyFlags = answers.safetyFlags.length > 0;
    const now = new Date().toISOString();

    const admin = getAdminClient();

    // Check if subscriber already exists so we don't overwrite existing consent
    const { data: existing } = await admin
      .from("newsletter_subscribers")
      .select("id, marketing_consent, confirmed, unsubscribed_at")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // Returning subscriber: only update consent fields if they're newly consenting.
      // Never downgrade existing consent (user may have consented from another flow).
      // Never re-subscribe someone who explicitly unsubscribed.
      if (marketingConsent && !existing.marketing_consent && !existing.unsubscribed_at) {
        const { error: updateErr } = await admin
          .from("newsletter_subscribers")
          .update({
            marketing_consent: true,
            consent_timestamp: now,
            consent_source: "quiz_step9",
            metabolic_profile: match.profile,
            quiz_goal: answers.goal ?? null,
            region: region ?? null,
            has_safety_flags: hasSafetyFlags,
            updated_at: now,
          })
          .eq("id", existing.id);

        if (updateErr) {
          console.error("Newsletter consent update error:", updateErr);
        } else if (!existing.confirmed) {
          // Send double opt-in confirmation email since they've now consented
          // but haven't confirmed yet. Fire-and-forget — non-fatal.
          sendConfirmationEmail(email).catch((err) =>
            console.error("Confirmation email failed (returning subscriber):", err)
          );
        }
      } else {
        // Even if not consenting to marketing, update profile data for future use
        await admin
          .from("newsletter_subscribers")
          .update({
            metabolic_profile: match.profile,
            quiz_goal: answers.goal ?? null,
            region: region ?? null,
            has_safety_flags: hasSafetyFlags,
            updated_at: now,
          })
          .eq("id", existing.id);
      }
    } else {
      // New subscriber: insert with consent status and profile
      const { error: insertErr } = await admin
        .from("newsletter_subscribers")
        .insert({
          email,
          source: "quiz",
          country: country ?? null,
          confirmed: false,
          marketing_consent: marketingConsent ?? false,
          consent_timestamp: marketingConsent ? now : null,
          consent_source: marketingConsent ? "quiz_step9" : null,
          metabolic_profile: match.profile,
          quiz_goal: answers.goal ?? null,
          region: region ?? null,
          has_safety_flags: hasSafetyFlags,
          updated_at: now,
        });

      if (insertErr && insertErr.code !== "23505") {
        console.error("Newsletter insert error:", insertErr);
      }

      // Send confirmation email ONLY if they explicitly consented to marketing.
      // Without consent, we do not send any marketing or nurture emails.
      if (marketingConsent && !insertErr) {
        sendConfirmationEmail(email).catch((err) =>
          console.error("Confirmation email failed (new subscriber):", err)
        );
      }
    }
  }

  return { success: true, profileId: sessionId };
}
