import { ShieldCheck } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <aside className="mt-16 rounded-2xl bg-gradient-to-br from-secondary to-muted border border-border/60 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-forest-100">
          <ShieldCheck className="h-5 w-5 text-forest-600" aria-hidden />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">
            Educational content only
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This article is for educational purposes and does not constitute medical advice.
            The information is based on publicly available peer-reviewed research and is
            intended to support informed conversations with qualified healthcare providers —
            not to replace professional medical judgment.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Always consult a qualified healthcare provider before making changes to your
            diet, exercise, or treatment plan.
          </p>
        </div>
      </div>
    </aside>
  );
}
