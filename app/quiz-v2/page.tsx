// Quiz v2 — shadow route for internal testing.
// NOT linked from the main navigation. Does NOT replace /quiz.
// Access via: /quiz-v2

import type { Metadata } from "next";
import { QuizStepperV2 } from "@/components/quiz/QuizStepperV2";

export const metadata: Metadata = {
  title: "Metabolic Profile Quiz v2 | InsulinIQ",
  description:
    "Build your personalised metabolic educational profile — educational only, not a diagnosis.",
  // Prevent indexing of shadow route until ready for public launch
  robots: { index: false, follow: false },
};

export default function QuizV2Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-forest-50/40 to-white py-10 px-4">
      {/* Internal testing banner — remove before public launch */}
      <div className="max-w-2xl mx-auto mb-6">
        <p className="rounded-xl border border-honey-300 bg-honey-50 px-4 py-2 text-xs text-honey-800 text-center font-medium">
          🔧 Quiz v2 — Internal testing only · Not public · Does not replace /quiz
        </p>
      </div>

      <QuizStepperV2 />
    </main>
  );
}
