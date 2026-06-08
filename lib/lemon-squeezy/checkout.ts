import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { initLemonSqueezy } from "./client";

export const PLANS = {
  "plan-14-days": {
    variantId: process.env.LS_VARIANT_14_DAYS!,
    name: "14-Day Plan",
    prices: { US: "$19", GB: "£16", AU: "$29 AUD" },
  },
  "plan-21-days": {
    variantId: process.env.LS_VARIANT_21_DAYS!,
    name: "21-Day Plan",
    prices: { US: "$34", GB: "£28", AU: "$49 AUD" },
  },
  "plan-45-days": {
    variantId: process.env.LS_VARIANT_45_DAYS!,
    name: "45-Day Plan",
    prices: { US: "$59", GB: "£49", AU: "$84 AUD" },
  },
  "subscription-basic": {
    variantId: process.env.LS_VARIANT_SUB_BASIC!,
    name: "Basic Subscription",
    prices: { US: "$9/mo", GB: "£7/mo", AU: "$13/mo AUD" },
  },
  "subscription-premium": {
    variantId: process.env.LS_VARIANT_SUB_PREMIUM!,
    name: "Premium Subscription",
    prices: { US: "$19/mo", GB: "£15/mo", AU: "$28/mo AUD" },
  },
  "subscription-community": {
    variantId: process.env.LS_VARIANT_SUB_COMMUNITY!,
    name: "Community Subscription",
    prices: { US: "$24/mo", GB: "£19/mo", AU: "$35/mo AUD" },
  },
} as const;

export type PlanId = keyof typeof PLANS;

export async function createCheckoutUrl(
  planId: PlanId,
  userEmail?: string,
  userId?: string
): Promise<string> {
  initLemonSqueezy();

  const plan = PLANS[planId];
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID!;

  const { data, error } = await createCheckout(storeId, plan.variantId, {
    checkoutOptions: {
      embed: false,
      media: true,
      logo: true,
    },
    checkoutData: {
      email: userEmail,
      custom: userId ? { user_id: userId } : undefined,
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      receiptButtonText: "Go to Dashboard",
    },
  });

  if (error || !data) {
    throw new Error(`Failed to create checkout: ${error?.message}`);
  }

  return data.data.attributes.url;
}
