import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { verifyEmailToken } from "@/lib/utils/email-tokens";
import { sendWelcomeEmail } from "@/lib/resend/emails";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const email = searchParams.get("e");
  const token = searchParams.get("t");

  if (!email || !token || !verifyEmailToken(email, token)) {
    return new NextResponse("Invalid or expired confirmation link.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const supabase = getAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true })
    .eq("email", email)
    .eq("confirmed", false);

  if (error) {
    console.error("Confirm email error:", error);
    return new NextResponse("Something went wrong. Please try again.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Send welcome email only after confirmed — fire-and-forget
  sendWelcomeEmail(email).catch((err) =>
    console.error("Welcome email failed:", err)
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/";
  return NextResponse.redirect(`${appUrl}?newsletter=confirmed`, { status: 302 });
}
