import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, BookOpen, Leaf, Droplet, Activity } from "lucide-react";

const contentLinks = [
  {
    href: "/pcos",
    label: "PCOS Hub",
    description: "Polycystic ovary syndrome & insulin",
    icon: Leaf,
    color: "bg-sage-50 text-sage-700 border-sage-200",
    iconColor: "text-sage-600",
  },
  {
    href: "/prediabetes",
    label: "Prediabetes Hub",
    description: "Blood sugar, fasting glucose & HbA1c",
    icon: Activity,
    color: "bg-clay-50 text-clay-700 border-clay-200",
    iconColor: "text-clay-600",
  },
  {
    href: "/nafld",
    label: "NAFLD / MASLD",
    description: "Metabolic-associated fatty liver",
    icon: Droplet,
    color: "bg-honey-50 text-honey-700 border-honey-200",
    iconColor: "text-honey-600",
  },
  {
    href: "/learn",
    label: "Article Library",
    description: "All evidence-based articles",
    icon: BookOpen,
    color: "bg-forest-50 text-forest-700 border-forest-200",
    iconColor: "text-forest-600",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your metabolic health education hub
        </p>
      </div>

      {/* Subscription status */}
      <div className={`rounded-2xl border p-6 mb-10 ${subscription ? "bg-forest-50 border-forest-200" : "bg-secondary/50 border-border"}`}>
        {subscription ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-forest-600 mb-1">
                Active plan
              </p>
              <p className="text-lg font-bold text-foreground capitalize">
                {subscription.plan_id.replace(/-/g, " ")}
              </p>
              {subscription.current_period_end && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Access until{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-forest-500 flex-shrink-0 mt-1.5" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">No active plan</p>
              <p className="text-sm text-muted-foreground">
                Upgrade to unlock personalised meal plans and full content access.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-forest-700"
            >
              See plans
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Content quick access */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-5">Your learning library</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {contentLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-sm hover:-translate-y-px ${item.color}`}
            >
              <div className={`p-2 rounded-xl bg-white/60 flex-shrink-0 ${item.iconColor}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{item.label}</p>
                <p className="mt-0.5 text-xs opacity-70 leading-relaxed">{item.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 opacity-40 group-hover:opacity-70 transition-opacity mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-10 rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center">
        <p className="text-sm font-semibold text-foreground/60">Coming Q3 2026</p>
        <p className="mt-1 text-sm text-muted-foreground">
          AI metabolic health assistant · Personalised meal plans · Progress tracking
        </p>
      </div>

    </div>
  );
}
