import type { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const metadata = {
  title: "Plans & Pricing | InsulinIQ",
  description:
    "Choose a plan to unlock personalised meal plans, condition deep-dives, and your AI metabolic health assistant.",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
