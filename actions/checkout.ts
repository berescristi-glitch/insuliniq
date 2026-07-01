"use server";

import { createCheckoutUrl, type PlanId } from "@/lib/lemon-squeezy/checkout";
import { createClient } from "@/lib/supabase/server";
import type { CheckoutMetadata } from "@/components/pricing/CheckoutButton";

// TODO (pre-launch checklist):
// Once CHECKOUT_ENABLED = true, forward metadata to createCheckoutUrl so
// Lemon Squeezy stores profile + source in custom checkout data.
// This enables post-purchase segmentation (e.g. send PCOS-specific onboarding email).
//
// checkoutData: {
//   email: userEmail,
//   custom: {
//     user_id: userId,
//     profile: metadata?.profile,   // "pcos" | "nafld" | "prediabetes" etc.
//     source:  metadata?.source,    // "pricing_page" | "quiz_results"
//     region:  metadata?.region,    // "UK" | "US" | "AU"
//   },
// }

export async function createCheckoutSession(
  planId: PlanId,
  // metadata is accepted but not yet forwarded — waiting for LS production setup
  _metadata?: CheckoutMetadata
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const url = await createCheckoutUrl(
      planId,
      user?.email,
      user?.id
    );

    return { url };
  } catch (err) {
    console.error("Checkout error:", err);
    return { error: "Checkout is not yet available. Please check back soon." };
  }
}
