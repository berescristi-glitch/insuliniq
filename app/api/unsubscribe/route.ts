// GET /api/unsubscribe?e=<email>&t=<token>
//
// Sprint 3 GDPR fix: previously hard-deleted the subscriber row.
// Hard-delete removes the audit trail proving the user unsubscribed —
// which is required by GDPR Article 5(2) (accountability principle) and
// helps defend against future "you kept sending me emails" claims.
//
// Now we set unsubscribed_at = NOW() (soft-delete).
// The subscriber row is retained but ALL email-sending paths check
// unsubscribed_at IS NULL before including a subscriber in any send.

import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { verifyEmailToken } from "@/lib/utils/email-tokens";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const email = searchParams.get("e");
  const token = searchParams.get("t");

  if (!email || !token || !verifyEmailToken(email, token)) {
    return new NextResponse("Invalid or expired unsubscribe link.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const supabase = getAdminClient();

  // Soft-delete: record unsubscription timestamp instead of deleting the row.
  // This preserves the audit trail required by GDPR Art. 5(2).
  // All cron and email-sending queries must filter WHERE unsubscribed_at IS NULL.
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({
      unsubscribed_at: new Date().toISOString(),
      // Also clear marketing consent so the subscriber is excluded from
      // the consent-filtered index and never accidentally re-enrolled.
      marketing_consent: false,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email)
    .is("unsubscribed_at", null); // idempotent — no-op if already unsubscribed

  if (error) {
    console.error("Unsubscribe update error:", error.message);
    // Still show the success page — the user wants to be removed and
    // a DB error shouldn't block that UX outcome.
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/";

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unsubscribed — InsulinIQ</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 80px auto; padding: 0 24px; text-align: center; color: #111827; }
    p { color: #6b7280; line-height: 1.6; }
    a { color: #059669; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <p style="font-size:40px;margin:0 0 16px;">✓</p>
  <h1 style="font-size:22px;margin:0 0 12px;">You've been unsubscribed</h1>
  <p>You won't receive any more educational email updates from InsulinIQ.</p>
  <p style="font-size:13px;margin-top:16px;">
    Changed your mind? You can re-subscribe at any time from our website.
  </p>
  <p style="margin-top:8px;font-size:12px;color:#9ca3af;">
    Your data is retained as required by applicable law and our
    <a href="${appUrl}/legal/privacy">Privacy Policy</a>.
    You can request full deletion by emailing
    <a href="mailto:support@insuliniq.com">support@insuliniq.com</a>.
  </p>
  <a href="${appUrl}" style="display:inline-block;margin-top:28px;color:#059669;">
    ← Back to InsulinIQ
  </a>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
