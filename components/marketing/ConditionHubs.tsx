import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const hubs = [
  {
    href: "/pcos",
    title: "PCOS",
    description:
      "Polycystic ovary syndrome and its connection to insulin resistance — symptoms, diet strategies, and lifestyle interventions.",
    color: "bg-purple-50 border-purple-100",
    accent: "text-purple-700",
  },
  {
    href: "/prediabetes",
    title: "Prediabetes",
    description:
      "Catch blood sugar dysregulation early. Learn the signs, A1C ranges, and evidence-based reversal strategies.",
    color: "bg-amber-50 border-amber-100",
    accent: "text-amber-700",
  },
  {
    href: "/nafld",
    title: "NAFLD / MASLD",
    description:
      "Non-alcoholic fatty liver disease — causes, progression stages, and dietary patterns that reduce liver fat.",
    color: "bg-blue-50 border-blue-100",
    accent: "text-blue-700",
  },
  {
    href: "/obesity",
    title: "Obesity",
    description:
      "Understanding the metabolic drivers of weight gain beyond calories — hormones, sleep, and sustainable interventions.",
    color: "bg-rose-50 border-rose-100",
    accent: "text-rose-700",
  },
  {
    href: "/metabolic-syndrome",
    title: "Metabolic Syndrome",
    description:
      "Five interconnected risk factors — waist circumference, blood pressure, glucose, triglycerides, and HDL.",
    color: "bg-teal-50 border-teal-100",
    accent: "text-teal-700",
  },
  {
    href: "/learn",
    title: "All Articles",
    description:
      "Browse the full InsulinIQ knowledge base — research summaries, practical guides, and deep dives.",
    color: "bg-gray-50 border-gray-100",
    accent: "text-gray-700",
  },
];

export function ConditionHubs() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore by condition
          </h2>
          <p className="mt-3 text-gray-500">
            Each hub is built around the research — no fluff, no pseudoscience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map((hub) => (
            <Link key={hub.href} href={hub.href} className="group">
              <Card
                className={`h-full border transition-shadow hover:shadow-md ${hub.color}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg ${hub.accent}`}>
                    {hub.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{hub.description}</p>
                  <div
                    className={`mt-4 flex items-center gap-1 text-sm font-medium ${hub.accent}`}
                  >
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
