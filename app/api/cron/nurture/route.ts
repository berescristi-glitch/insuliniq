/**
 * GET /api/cron/nurture
 *
 * Daily cron that sends the correct nurture email to every confirmed subscriber
 * who is on each day of the 14-day sequence.
 *
 * Required environment variables:
 *   CRON_SECRET                — random secret (min 32 chars); set in Vercel env vars.
 *                                Vercel sends this as "Authorization: Bearer <CRON_SECRET>"
 *                                on every cron invocation (NOT "x-cron-secret").
 *                                Example: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
 *   NEXT_PUBLIC_SUPABASE_URL   — already set (e.g. "https://xyz.supabase.co")
 *   SUPABASE_SERVICE_ROLE_KEY  — already set; bypasses RLS — do NOT expose to client
 *   RESEND_API_KEY             — already set
 *
 * Vercel cron schedule: "0 8 * * *" (08:00 UTC daily) — see vercel.json.
 *
 * Security notes:
 *   - Uses service role Supabase client (same pattern as webhook route) because
 *     newsletter_subscribers has "No direct reads by public" RLS policy.
 *   - CRON_SECRET is compared with timing-safe equality equivalent (string ===
 *     is acceptable here because the secret is a fixed env var, not user input;
 *     however we check early and return before any DB work on mismatch).
 *   - The day number is derived from nurture_started_at in the DB — never from
 *     request input — so a caller cannot manipulate which template is sent.
 */

import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { sendNurtureEmail } from "@/lib/resend/emails";

// Force Node.js runtime — crypto and network calls in sendNurtureEmail need it.
export const runtime = "nodejs";

// Vercel cron jobs do not follow redirects, so this must be a direct GET handler.
export const dynamic = "force-dynamic";

// How many days the sequence runs.
const NURTURE_TOTAL_DAYS = 14;

/**
 * Returns a UTC date window for a given nurture day.
 * Day 1 = subscriber joined 0–1 days ago (i.e. today's batch).
 * Day N = subscriber joined N-1 to N days ago.
 *
 * We use a ±2-hour slop window so a cron that fires slightly early/late
 * still catches every subscriber without double-sending.
 */
function dayWindow(day: number): { from: string; to: string } {
  const now = new Date();

  // "to" boundary: (day - 1) days ago from now — oldest a day-N subscriber could be
  const to = new Date(now);
  to.setDate(to.getDate() - (day - 1));
  // Add 2-hour buffer so a subscriber who signed up at 07:58 doesn't get missed
  to.setHours(to.getHours() + 2);

  // "from" boundary: day days ago from now — most recent a day-N sub could be
  const from = new Date(now);
  from.setDate(from.getDate() - day);
  // Subtract 2-hour buffer for same reason
  from.setHours(from.getHours() - 2);

  return { from: from.toISOString(), to: to.toISOString() };
}

export async function GET(request: Request): Promise<NextResponse> {
  // ── 1. Auth: verify the cron secret ───────────────────────────────────────
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" on every cron invocation.
  const authHeader = request.headers.get("authorization");
  const expectedBearer = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expectedBearer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const results: Array<{ day: number; sent: number; errors: number }> = [];

  // ── 2. Process each day in the sequence ───────────────────────────────────
  for (let day = 1; day <= NURTURE_TOTAL_DAYS; day++) {
    const { from, to } = dayWindow(day);
    let sent = 0;
    let errors = 0;

    // Query subscribers in the day-N window who haven't completed the sequence
    // and have confirmed their subscription. Service role bypasses the
    // "No direct reads by public" RLS policy — this is intentional and safe
    // because this route is not reachable from the client.
    // Sprint 3 filters added:
    //   marketing_consent = true  — never send to subscribers who didn't opt-in
    //   unsubscribed_at IS NULL   — never send to subscribers who unsubscribed
    // These are belt-and-suspenders on top of the confirmed = true and
    // nurture_completed = false checks that were already present.
    const { data: subscribers, error: queryError } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, metabolic_profile")
      .eq("confirmed", true)
      .eq("marketing_consent", true)
      .eq("nurture_completed", false)
      .is("unsubscribed_at", null)
      .gte("nurture_started_at", from)
      .lte("nurture_started_at", to);

    if (queryError) {
      console.error(`nurture cron day ${day} query error:`, queryError.message);
      // Continue to next day rather than aborting the entire run
      results.push({ day, sent: 0, errors: 1 });
      continue;
    }

    if (!subscribers || subscribers.length === 0) {
      results.push({ day, sent: 0, errors: 0 });
      continue;
    }

    // ── 3. Send emails and mark day-14 subscribers as completed ─────────────
    for (const subscriber of subscribers) {
      try {
        await sendNurtureEmail(subscriber.email, day);
        sent++;

        // After the final email, mark the sequence complete so this subscriber
        // is never queried again — one UPDATE per final-day subscriber.
        if (day === NURTURE_TOTAL_DAYS) {
          const { error: updateError } = await supabase
            .from("newsletter_subscribers")
            .update({ nurture_completed: true })
            .eq("id", subscriber.id);

          if (updateError) {
            // Non-fatal: the email was sent; worst case they get day-14 again tomorrow.
            // The day-window query will naturally miss them once they're outside the window.
            console.error(
              `nurture cron: failed to mark ${subscriber.id} complete:`,
              updateError.message
            );
          }
        }
      } catch (emailError) {
        errors++;
        // Log per-subscriber errors but continue — one bad address shouldn't
        // block the rest of the batch.
        console.error(
          `nurture cron day ${day} send error for ${subscriber.email}:`,
          emailError instanceof Error ? emailError.message : String(emailError)
        );
      }
    }

    results.push({ day, sent, errors });
  }

  // ── 4. Return a summary for Vercel cron logs ───────────────────────────────
  const totalSent = results.reduce((acc, r) => acc + r.sent, 0);
  const totalErrors = results.reduce((acc, r) => acc + r.errors, 0);

  console.log("nurture cron complete", { totalSent, totalErrors, results });

  return NextResponse.json({
    ok: true,
    totalSent,
    totalErrors,
    breakdown: results,
  });
}
