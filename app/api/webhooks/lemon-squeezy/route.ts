import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
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

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature") ?? "";
  const body = await request.text();

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body) as Record<string, unknown>;
  } catch (err) {
    console.error("Lemon Squeezy webhook: malformed JSON body", err);
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  const eventName = (event.meta as Record<string, unknown>)?.event_name as string ?? "";
  const data = event.data as Record<string, unknown> ?? {};
  const attrs = data.attributes as Record<string, unknown> ?? {};
  const customData = (event.meta as Record<string, unknown>)?.custom_data as Record<string, unknown> ?? {};

  const supabase = getAdminClient();

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
    case "subscription_resumed":
    case "subscription_payment_failed":
    case "subscription_payment_recovered": {
      const { error: subUpsertError } = await supabase
        .from("subscriptions")
        .upsert(
          {
            lemon_squeezy_subscription_id: String(data.id),
            lemon_squeezy_customer_id: String(attrs.customer_id),
            user_id: String(customData.user_id),
            plan_id: String(attrs.variant_id),
            status: attrs.status as SubscriptionStatus,
            current_period_end: (attrs.renews_at as string) ?? null,
          },
          { onConflict: "lemon_squeezy_subscription_id" }
        );

      if (subUpsertError) {
        console.error("Subscription upsert error:", subUpsertError);
      }
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
      if (!variantId) break;

      // days: null = lifetime access (no expiration), e.g. the Starter Kit
      const oneTimePlans: Record<string, { days: number | null; name: string }> = {
        [process.env.LS_VARIANT_14_DAYS ?? ""]: { days: 14, name: "14-Day Plan" },
        [process.env.LS_VARIANT_21_DAYS ?? ""]: { days: 21, name: "21-Day Plan" },
        [process.env.LS_VARIANT_45_DAYS ?? ""]: { days: 45, name: "45-Day Plan" },
        [process.env.LS_VARIANT_STARTER_KIT ?? ""]: { days: null, name: "Starter Kit" },
      };

      const plan = oneTimePlans[variantId];
      if (!plan) break;

      let expiresAt: string | null = null;
      if (plan.days !== null) {
        const d = new Date();
        d.setDate(d.getDate() + plan.days);
        expiresAt = d.toISOString();
      }

      const { error: orderInsertError } = await supabase
        .from("subscriptions")
        .insert({
          lemon_squeezy_subscription_id: `order_${String(data.id)}`,
          lemon_squeezy_customer_id: String(attrs.customer_id ?? ""),
          user_id: userId,
          plan_id: variantId,
          status: "active",
          current_period_end: expiresAt,
        });

      if (orderInsertError) {
        if (orderInsertError.code === "23505") {
          // Duplicate webhook delivery for an order we already processed —
          // access was already granted, don't resend the confirmation email.
          console.log(`order_created: duplicate delivery for order ${String(data.id)}, skipping`);
          break;
        }
        console.error("Order insert error:", orderInsertError);
        break;
      }

      const userEmail = String(attrs.user_email ?? "");
      if (userEmail) {
        sendPurchaseConfirmationEmail(userEmail, plan.name).catch((err) =>
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
