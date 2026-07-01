// Cautious banner shown on quiz results when the user flagged a high-risk
// safety item (CLAUDE.md §16). Styled like MedicalDisclaimer but with a
// clay/honey accent to distinguish "do this before you buy a meal plan"
// from the generic educational disclaimer.

import { HeartPulse } from "lucide-react";
import { getSafetyNotice } from "@/lib/quiz/matcher";
import type { QuizAnswers } from "@/lib/quiz/types";

export function SafetyNotice({ answers }: { answers: QuizAnswers }) {
  const notice = getSafetyNotice(answers);
  if (!notice) return null;

  return (
    <aside className="mb-8 rounded-2xl bg-gradient-to-br from-clay-50 to-honey-50 border border-clay-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-clay-100">
          <HeartPulse className="h-5 w-5 text-clay-700" aria-hidden />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">
            Please check with a doctor first
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {notice}
          </p>
        </div>
      </div>
    </aside>
  );
}
