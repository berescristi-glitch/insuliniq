import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyEmailToken } from "@/lib/utils/email-tokens";
import type { Database } from "@/types/database";

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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
  await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("email", email);

  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Unsubscribed</title></head>
<body style="font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 24px;text-align:center;">
  <p style="font-size:36px;">✓</p>
  <h1 style="font-size:22px;color:#111827;">You've been unsubscribed</h1>
  <p style="color:#6b7280;">You won't receive any more emails from InsulinIQ.</p>
  <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "/"}"
     style="display:inline-block;margin-top:24px;color:#059669;text-decoration:none;">
    ← Back to InsulinIQ
  </a>
</body></html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
