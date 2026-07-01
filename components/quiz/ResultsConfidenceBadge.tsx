// Shared confidence badge for /quiz-v2/results (server path + skip path).
// Shows the profile match confidence level with a non-clinical disclaimer.
// profileConfidence is NOT a medical certainty — always displayed with that note.

import type { ProfileConfidence } from "@/lib/quiz/types-v2";

interface Props {
  confidence: ProfileConfidence;
  personalizationNote?: string;
}

const COLOR: Record<ProfileConfidence, string> = {
  high:     "bg-forest-100 border-forest-300 text-forest-800",
  moderate: "bg-honey-50  border-honey-300  text-honey-800",
  low:      "bg-muted      border-border      text-muted-foreground",
};

const LABEL: Record<ProfileConfidence, string> = {
  high:     "High profile confidence",
  moderate: "Moderate profile confidence",
  low:      "Low profile confidence — more answers would improve accuracy",
};

export function ResultsConfidenceBadge({ confidence, personalizationNote }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8">
      <div className={`rounded-xl border px-4 py-3 text-xs font-medium ${COLOR[confidence]}`}>
        <span className="font-semibold">{LABEL[confidence]}</span>
        <span className="font-normal opacity-80 ml-1">
          — This reflects how complete and consistent your quiz answers are. Not a clinical certainty.
        </span>
        {personalizationNote && (
          <p className="mt-1.5 font-normal opacity-90">{personalizationNote}</p>
        )}
      </div>
    </div>
  );
}
