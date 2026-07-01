"use server";

// Server Action: enroll a quiz email into the nurture sequence.
//
// Sprint 3 changes:
//   • marketing_consent is now required before enrollment.
//     If the subscriber did not explicitly opt-in at Step 9, we do NOT
//     enroll them in any marketing email sequence (GDPR / PECR / AU Spam Act).
//   • unsubscribed_at guard: never re-enroll someone who has unsubscribed.
//   • Accepts optional context (metabolicProfile, goal, region) to update
//     the subscriber row when profile data is available from the results page.
//
// Called from: app/quiz/results/page.tsx (after loading DB session).
// This is idempotent — safe to call on every results-page load.

import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";

const EmailSchema = z.string().email();

export interface NurtureContext {
  metabolicProfile?: string;
  goal?: string;
  region?: string;
}

export async function enrollInNurture(
  email: string,
  context?: NurtureContext
): Promise<void> {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) return;

  const supabase = getAdminClient();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, marketing_consent, confirmed, nurture_started_at, nurture_completed, unsubscribed_at, metabolic_profile")
    .eq("email", parsed.data)
    .maybeSingle();

  if (!existing) {
    // No subscriber row at all means the user skipped the email step or
    // the quiz action failed. Do NOT create a subscriber here without consent —
    // we have no consent record for an unknown user.
    return;
  }

  // Gate 1: must not be unsubscribed
  if (existing.unsubscribed_at !== null) {
    return;
  }

  // Gate 2: must have explicit marketing consent
  // This is the critical GDPR/PECR/AU Spam Act gate. Without it, no nurture.
  if (!existing.marketing_consent) {
    return;
  }

  const now = new Date().toISOString();

  if (existing.nurture_started_at !== null || existing.nurture_completed) {
    // Already in sequence or completed — just update profile context if
    // we have new data and the field was previously null.
    if (context && !existing.metabolic_profile) {
      await supabase
        .from("newsletter_subscribers")
        .update({
          metabolic_profile: context.metabolicProfile ?? null,
          quiz_goal: context.goal ?? null,
          region: context.region ?? null,
          updated_at: now,
        })
        .eq("id", existing.id);
    }
    return;
  }

  // Enroll: set nurture_started_at and update profile context
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({
      nurture_started_at: now,
      // Update profile fields if provided and not already set
      ...(context?.metabolicProfile && !existing.metabolic_profile
        ? { metabolic_profile: context.metabolicProfile }
        : {}),
      ...(context?.goal ? { quiz_goal: context.goal } : {}),
      ...(context?.region ? { region: context.region } : {}),
      updated_at: now,
    })
    .eq("id", existing.id);

  if (error) {
    console.error("enrollInNurture update error:", error.message);
  }
}
