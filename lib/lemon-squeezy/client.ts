import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function initLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
    onError(error) {
      console.error("Lemon Squeezy error:", error);
    },
  });
}
