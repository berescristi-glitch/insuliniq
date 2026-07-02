import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

// insuliniq.com domain not yet registered — using Resend shared sender for internal testing.
// Switch to "InsulinIQ <hello@insuliniq.com>" once domain is verified in Resend dashboard.
export const FROM_EMAIL =
  process.env.FROM_EMAIL_OVERRIDE ?? "onboarding@resend.dev";
