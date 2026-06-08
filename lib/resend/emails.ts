import { resend, FROM_EMAIL } from "./client";

export async function sendWelcomeEmail(email: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to InsulinIQ — your free resources are inside",
    html: welcomeEmailHtml(),
  });
}

export async function sendPurchaseConfirmationEmail(
  email: string,
  planName: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your InsulinIQ ${planName} is ready`,
    html: purchaseConfirmationHtml(planName),
  });
}

export async function sendWeeklyTipsEmail(email: string, tipHtml: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "This week's metabolic health insight",
    html: weeklyTipsHtml(tipHtml),
  });
}

// ── Email templates ───────────────────────────────────────────────────

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>InsulinIQ</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="background:#065f46;padding:24px 40px;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">InsulinIQ</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                This content is for educational purposes only and does not constitute medical advice.
                Always consult a qualified healthcare provider.<br/><br/>
                InsulinIQ · <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function welcomeEmailHtml() {
  return baseLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Welcome to InsulinIQ!</h1>
    <p style="color:#374151;line-height:1.6;">
      You've taken the first step toward understanding your metabolic health.
      Here's what you can explore right now:
    </p>
    <ul style="color:#374151;line-height:2;padding-left:20px;">
      <li><strong>Take the free quiz</strong> — get your personalized metabolic profile</li>
      <li><strong>Explore condition hubs</strong> — PCOS, prediabetes, NAFLD & more</li>
      <li><strong>Browse low-glycemic recipes</strong> — practical meal ideas</li>
    </ul>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/quiz"
       style="display:inline-block;margin-top:24px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
      Take the Free Quiz
    </a>
    <p style="margin-top:32px;color:#6b7280;font-size:13px;">
      Questions? Reply to this email — we read everything.
    </p>
  `);
}

function purchaseConfirmationHtml(planName: string) {
  return baseLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">You're in — ${planName} activated</h1>
    <p style="color:#374151;line-height:1.6;">
      Your plan is now active. Head to your dashboard to access all your content,
      personalized meal plans, and AI assistant.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
       style="display:inline-block;margin-top:24px;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
      Go to Dashboard
    </a>
  `);
}

function weeklyTipsHtml(tipHtml: string) {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">This week on InsulinIQ</h2>
    ${tipHtml}
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/learn"
       style="display:inline-block;margin-top:24px;color:#059669;text-decoration:none;font-weight:600;">
      Read more articles →
    </a>
  `);
}
