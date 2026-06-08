import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type SubscriptionStatus =
  Database["public"]["Tables"]["subscriptions"]["Row"]["status"];

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return expected === signature;
}

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature") ?? "";
  const body = await request.text();

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as Record<string, unknown>;
  const eventName = (event.meta as Record<string, unknown>)?.event_name as string ?? "";
  const data = event.data as Record<string, unknown> ?? {};
  const attrs = data.attributes as Record<string, unknown> ?? {};
  const customData = (event.meta as Record<string, unknown>)?.custom_data as Record<string, unknown> ?? {};

  const supabase = getAdminClient();

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
    case "subscription_resumed": {
      await supabase.from("subscriptions").upsert({
        lemon_squeezy_subscription_id: String(data.id),
        lemon_squeezy_customer_id: String(attrs.customer_id),
        user_id: String(customData.user_id),
        plan_id: String(attrs.variant_id),
        status: attrs.status as SubscriptionStatus,
        current_period_end: (attrs.renews_at as string) ?? null,
      });
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired":
    case "subscription_paused": {
      const statusMap: Record<string, SubscriptionStatus> = {
        subscription_cancelled: "cancelled",
        subscription_expired: "expired",
        subscription_paused: "paused",
      };
      await supabase
        .from("subscriptions")
        .update({ status: statusMap[eventName] })
        .eq("lemon_squeezy_subscription_id", String(data.id));
      break;
    }

    default:
      console.log(`Unhandled Lemon Squeezy event: ${eventName}`);
  }

  return NextResponse.json({ received: true });
}
