import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const hubs = [
  {
    href: "/pcos",
    title: "PCOS",
    description:
      "Polycystic ovary syndrome and its connection to insulin resistance — symptoms, diet strategies, and lifestyle interventions.",
    bg:     "bg-sage-50",
    border: "border-sage-100",
    title_color: "text-sage-700",
    arrow_color: "text-sage-600",
  },
  {
    href: "/prediabetes",
    title: "Prediabetes",
    description:
      "Catch blood sugar dysregulation early. Learn the signs, A1C ranges, and evidence-based strategies from the landmark DPP trial.",
    bg:     "bg-clay-50",
    border: "border-clay-100",
    title_color: "text-clay-700",
    arrow_color: "text-clay-600",
  },
  {
    href: "/nafld",
    title: "NAFLD / MASLD",
    description:
      "Non-alcoholic fatty liver disease — causes, the 2023 name change, and dietary patterns that reduce liver fat.",
    bg:     "bg-honey-50",
    border: "border-honey-100",
    title_color: "text-honey-700",
    arrow_color: "text-honey-600",
  },
  {
    href: "/obesity",
    title: "Obesity",
    description:
      "Understanding the metabolic drivers of weight gain beyond calories — hormones, sleep, and sustainable interventions.",
    bg:     "bg-rose-50",
    border: "border-rose-100",
    title_color: "text-rose-700",
    arrow_color: "text-rose-600",
  },
  {
    href: "/metabolic-syndrome",
    title: "Metabolic Syndrome",
    description:
      "Five interconnected risk factors — waist circumference, blood pressure, glucose, triglycerides, and HDL.",
    bg:     "bg-forest-50",
    border: "border-forest-100",
    title_color: "text-forest-700",
    arrow_color: "text-forest-600",
  },
  {
    href: "/learn",
    title: "All Articles",
    description:
      "Browse the full InsulinIQ knowledge base — research summaries, practical guides, and deep dives.",
    bg:     "bg-secondary",
    border: "border-border",
    title_color: "text-foreground",
    arrow_color: "text-muted-foreground",
  },
];

export function ConditionHubs() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Explore by condition
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each hub is built around the research — no fluff, no pseudoscience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map((hub) => (
            <Link key={hub.href} href={hub.href} className="group">
              <Card
                className={`h-full border transition-shadow hover:shadow-md ${hub.bg} ${hub.border}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg ${hub.title_color}`}>
                    {hub.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">{hub.description}</p>
                  <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${hub.arrow_color}`}>
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
