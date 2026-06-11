import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPurchaseConfirmationEmail } from "@/lib/resend/emails";
import type { Database } from "@/types/database";

type SubscriptionStatus =
  Database["public"]["Tables"]["subscriptions"]["Row"]["status"];

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(signature, "hex");
  return (
    expectedBuf.length === sigBuf.length &&
    timingSafeEqual(expectedBuf, sigBuf)
  );
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

    case "order_created": {
      if (attrs.status !== "paid") break;

      const userId = String(customData.user_id ?? "");
      if (!userId) {
        console.log("order_created: no user_id in custom_data — skipping subscription link");
        break;
      }

      const firstItem = (attrs.first_order_item ?? {}) as Record<string, unknown>;
      const variantId = String(firstItem.variant_id ?? "");

      const planDays: Record<string, number> = {
        [process.env.LS_VARIANT_14_DAYS ?? ""]: 14,
        [process.env.LS_VARIANT_21_DAYS ?? ""]: 21,
        [process.env.LS_VARIANT_45_DAYS ?? ""]: 45,
      };

      const days = planDays[variantId];
      if (!days) break;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      await supabase.from("subscriptions").insert({
        lemon_squeezy_subscription_id: `order_${String(data.id)}`,
        lemon_squeezy_customer_id: String(attrs.customer_id ?? ""),
        user_id: userId,
        plan_id: variantId,
        status: "active",
        current_period_end: expiresAt.toISOString(),
      });

      const userEmail = String(attrs.user_email ?? "");
      if (userEmail) {
        sendPurchaseConfirmationEmail(userEmail, `${days}-Day Plan`).catch((err) =>
          console.error("Purchase confirmation email failed:", err)
        );
      }
      break;
    }

    default:
      console.log(`Unhandled Lemon Squeezy event: ${eventName}`);
  }

  return NextResponse.json({ received: true });
}
