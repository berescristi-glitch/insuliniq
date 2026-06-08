"use server";

import { createCheckoutUrl, type PlanId } from "@/lib/lemon-squeezy/checkout";
import { createClient } from "@/lib/supabase/server";

export async function createCheckoutSession(planId: PlanId) {
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
    return { error: "Failed to create checkout session. Please try again." };
  }
}
