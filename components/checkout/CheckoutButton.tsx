"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/checkout";
import type { PlanId } from "@/lib/lemon-squeezy/checkout";

interface CheckoutButtonProps {
  planId: PlanId;
  label?: string;
  className?: string;
}

export function CheckoutButton({
  planId,
  label = "Get Started",
  className,
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const { url, error } = await createCheckoutSession(planId);
      if (error) {
        alert(error);
        return;
      }
      if (url) window.location.href = url;
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Loading…" : label}
    </Button>
  );
}
