"use server";

// Quiz analytics events — non-PII logging for v1 vs v2 A/B comparison.
// Never logs: email, sex, symptoms (raw), safety flags (specific), weight, lab values.
// Always fire-and-forget — analytics must never block the main flow.

import { getAdminClient } from "@/lib/supabase/admin";

export type QuizEventType = "quiz_completed" | "results_viewed" | "pricing_clicked";
export type CompletionPath = "email" | "skip" | "view_only";
export type EventSource = "direct" | "internal_test" | "ab_test";

export interface QuizAnalyticsEvent {
  quiz_version: "v1" | "v2";
  event_type: QuizEventType;
  matched_profile?: string;
  profile_confidence?: string;
  completion_path?: CompletionPath;
  marketing_consent?: boolean;
  has_safety_flags?: boolean;
  source?: EventSource;
  session_hash?: string;    // SHA-256 of session_id — never the raw UUID
}

// Simple deterministic hash of a session_id for correlation without storing raw ID
async function hashSessionId(sessionId: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(sessionId);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  } catch {
    return ""; // graceful fallback — analytics never blocks main flow
  }
}

export async function logQuizEvent(
  event: QuizAnalyticsEvent,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = getAdminClient();
    const session_hash = sessionId ? await hashSessionId(sessionId) : null;

    const { error } = await supabase.from("quiz_analytics_events").insert({
      quiz_version: event.quiz_version,
      event_type: event.event_type,
      matched_profile: event.matched_profile ?? null,
      profile_confidence: event.profile_confidence ?? null,
      completion_path: event.completion_path ?? null,
      marketing_consent: event.marketing_consent ?? null,
      has_safety_flags: event.has_safety_flags ?? null,
      source: event.source ?? "direct",
      session_hash,
    });

    if (error) {
      // Non-fatal — analytics failure never surfaces to user
      console.error("[analytics] insert error:", error.message);
    }
  } catch (err) {
    console.error("[analytics] unexpected error:", err instanceof Error ? err.message : String(err));
  }
}
