"use client";

import { useState } from "react";
import Link from "next/link";
import { createCheckoutSession } from "@/actions/checkout";
import type { PlanId } from "@/lib/lemon-squeezy/checkout";
import { CHECKOUT_ENABLED } from "@/lib/config/checkout";
import { Button } from "@/components/ui/button";

// Metadata forwarded to Lemon Squeezy custom data when checkout is enabled.
// TODO (Sprint 3): also capture region from the user's quiz answers/session.
export interface CheckoutMetadata {
  profile?: string;  // e.g. "pcos" | "nafld" | "prediabetes" etc.
  source?: string;   // e.g. "pricing_page" | "quiz_results"
  region?: string;   // e.g. "UK" | "US" | "AU"
}

interface CheckoutButtonProps {
  planId: PlanId;
  label?: string;
  className?: string;
  variant?: "default" | "outline";
  metadata?: CheckoutMetadata;
}

export function CheckoutButton({
  planId,
  label = "Get started",
  className,
  variant = "default",
  metadata,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<"idle" | "pending_launch" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleCheckout() {
    // Pre-launch guard — remove once CHECKOUT_ENABLED = true in lib/config/checkout.ts
    if (!CHECKOUT_ENABLED) {
      setState("pending_launch");
      return;
    }

    setLoading(true);
    setState("idle");
    setErrorMsg(null);

    const result = await createCheckoutSession(planId, metadata);

    if (result.url) {
      window.location.href = result.url;
    } else {
      setErrorMsg(result.error ?? "Checkout unavailable right now. Please try again.");
      setLoading(false);
      setState("error");
    }
  }

  return (
    <div>
      <Button
        onClick={handleCheckout}
        disabled={loading}
        variant={variant}
        className={className}
      >
        {loading ? "Redirecting…" : label}
      </Button>

      {/* Pre-launch message — shown when CHECKOUT_ENABLED = false */}
      {state === "pending_launch" && (
        <p className="mt-2 text-xs text-muted-foreground text-center leading-relaxed">
          We&apos;re finalising our checkout.{" "}
          <Link
            href="/register"
            className="font-medium text-forest-600 hover:underline"
          >
            Register to be notified at launch →
          </Link>
        </p>
      )}

      {/* Runtime checkout error */}
      {state === "error" && errorMsg && (
        <p className="mt-2 text-xs text-red-500 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
