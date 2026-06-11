import { ClipboardList, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface Step {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  dotColor: string;
}

const steps: Step[] = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Take the 5-minute quiz",
    description:
      "Answer questions about your symptoms, lifestyle, and lab values. No account needed — completely free.",
    iconBg: "bg-forest-100",
    iconColor: "text-forest-600",
    dotColor: "bg-forest-500",
  },
  {
    step: "02",
    icon: BarChart3,
    title: "Get your metabolic profile",
    description:
      "Instantly see which areas of metabolic health need your attention most, with a clear visual breakdown.",
    iconBg: "bg-honey-100",
    iconColor: "text-honey-700",
    dotColor: "bg-honey-500",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Learn what actually matters",
    description:
      "Dive into condition-specific guides backed by peer-reviewed research — not influencer advice or generic tips.",
    iconBg: "bg-sage-100",
    iconColor: "text-sage-600",
    dotColor: "bg-sage-500",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <p className="text-forest-600 font-semibold uppercase tracking-widest text-sm mb-3">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            From confusion to clarity
            <br className="hidden sm:block" />
            <span className="text-forest-600"> in 3 steps</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-xl mx-auto">
            No overwhelm. No medical jargon. Just a clear path to understanding
            your metabolic health.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
          {/* Connecting line — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[calc(16.7%+32px)] right-[calc(16.7%+32px)] h-px bg-gradient-to-r from-forest-200 via-honey-200 to-sage-200"
          />

          {steps.map((step) => (
            <div key={step.step} className="relative text-center group">
              <div className="flex justify-center mb-6">
                <div
                  className={`relative w-20 h-20 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:-translate-y-1`}
                >
                  <step.icon className={`h-9 w-9 ${step.iconColor}`} />
                  <span
                    className={`absolute -top-3 -right-3 w-7 h-7 rounded-full ${step.dotColor} text-white text-xs font-bold flex items-center justify-center shadow-sm`}
                  >
                    {step.step}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button
            size="lg"
            className="bg-forest-600 hover:bg-forest-700 text-white px-10 h-14 text-base rounded-xl shadow-lg shadow-forest-600/20 transition-all hover:-translate-y-0.5 hover:shadow-forest-600/30"
            asChild
          >
            <Link href="#quiz">Start the Free Quiz</Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Takes 5 minutes · No sign-up · Instant results
          </p>
        </div>
      </div>
    </section>
  );
}
