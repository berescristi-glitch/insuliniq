// ── Pre-launch checkout gate ──────────────────────────────────────────────────
//
// Set CHECKOUT_ENABLED = true only after ALL of the following are complete:
//
//   □  Company legally registered
//   □  Lemon Squeezy account created on legal entity (not personal)
//   □  Real variant IDs populated in production environment:
//        LS_VARIANT_STARTER_KIT
//        LS_VARIANT_CORE_MONTHLY
//        LS_VARIANT_CORE_ANNUAL
//   □  LEMON_SQUEEZY_STORE_ID and LEMON_SQUEEZY_API_KEY set in production
//   □  Webhook (LEMON_SQUEEZY_WEBHOOK_SECRET) configured + verified
//   □  Compliance review signed off
//   □  Checkout flow tested end-to-end in LS test mode
//   □  Refund process confirmed operational
//
// Until then, CheckoutButton shows a pre-launch message when clicked.
// This flag is read by both the client (CheckoutButton) and server (action).
// ─────────────────────────────────────────────────────────────────────────────

export const CHECKOUT_ENABLED = false;

// Human-readable explanation for why checkout is disabled.
// Used as a dev log — not shown to users directly.
export const CHECKOUT_DISABLED_REASON =
  "Checkout is pending company registration and Lemon Squeezy production setup. " +
  "Set CHECKOUT_ENABLED = true in lib/config/checkout.ts after completing all pre-launch checklist items.";
