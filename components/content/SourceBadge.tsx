import { FlaskConical, BarChart2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type EvidenceLevel = "strong" | "moderate" | "emerging";

interface SourceBadgeProps {
  level: EvidenceLevel;
  label?: string;
  className?: string;
}

const CONFIG: Record<
  EvidenceLevel,
  { label: string; detail: string; icon: React.ElementType; style: string; dot: string }
> = {
  strong: {
    label:  "Strong evidence",
    detail: "Meta-analysis / Multiple RCTs",
    icon:   BarChart2,
    style:  "bg-sage-100 text-sage-700 border-sage-200",
    dot:    "bg-sage-500",
  },
  moderate: {
    label:  "Moderate evidence",
    detail: "Single RCT or cohort studies",
    icon:   BookOpen,
    style:  "bg-honey-100 text-honey-700 border-honey-200",
    dot:    "bg-honey-500",
  },
  emerging: {
    label:  "Emerging evidence",
    detail: "Preliminary / Expert consensus",
    icon:   FlaskConical,
    style:  "bg-clay-100 text-clay-700 border-clay-200",
    dot:    "bg-clay-500",
  },
};

export function SourceBadge({ level, label, className }: SourceBadgeProps) {
  const { label: defaultLabel, detail, icon: Icon, style, dot } = CONFIG[level];

  return (
    <span
      title={detail}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dot)} aria-hidden />
      <Icon className="h-3 w-3 flex-shrink-0" aria-hidden />
      {label ?? defaultLabel}
    </span>
  );
}
