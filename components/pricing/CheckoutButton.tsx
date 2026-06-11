"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/checkout";
import type { PlanId } from "@/lib/lemon-squeezy/checkout";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  planId: PlanId;
  label?: string;
  className?: string;
  variant?: "default" | "outline";
}

export function CheckoutButton({
  planId,
  label = "Get started",
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutSession(planId);
    if (result.url) {
      window.location.href = result.url;
    } else {
      setError("Checkout unavailable right now. Please try again.");
      setLoading(false);
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
      {error && (
        <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
