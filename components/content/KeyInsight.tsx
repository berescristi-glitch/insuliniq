import { Lightbulb, FlaskConical, Zap, AlertCircle } from "lucide-react";

type InsightType = "insight" | "research" | "action" | "important";

interface KeyInsightProps {
  type?: InsightType;
  children: React.ReactNode;
}

const CONFIG: Record<
  InsightType,
  { bg: string; border: string; icon: React.ElementType; iconColor: string; label: string; labelColor: string }
> = {
  insight: {
    bg:         "bg-forest-50",
    border:     "border-forest-200",
    icon:       Lightbulb,
    iconColor:  "text-forest-500",
    label:      "Key insight",
    labelColor: "text-forest-600",
  },
  research: {
    bg:         "bg-sage-50",
    border:     "border-sage-200",
    icon:       FlaskConical,
    iconColor:  "text-sage-500",
    label:      "Research finding",
    labelColor: "text-sage-600",
  },
  action: {
    bg:         "bg-honey-50",
    border:     "border-honey-200",
    icon:       Zap,
    iconColor:  "text-honey-600",
    label:      "What this means for you",
    labelColor: "text-honey-700",
  },
  important: {
    bg:         "bg-clay-50",
    border:     "border-clay-200",
    icon:       AlertCircle,
    iconColor:  "text-clay-500",
    label:      "Important note",
    labelColor: "text-clay-600",
  },
};

export function KeyInsight({ type = "insight", children }: KeyInsightProps) {
  const { bg, border, icon: Icon, iconColor, label, labelColor } = CONFIG[type];

  return (
    <div className={`my-8 rounded-2xl border p-6 ${bg} ${border}`}>
      <div className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${labelColor}`}>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} aria-hidden />
        {label}
      </div>
      <div className="text-[1.0625rem] leading-[1.8] text-foreground/85 [&>p]:my-0">
        {children}
      </div>
    </div>
  );
}
