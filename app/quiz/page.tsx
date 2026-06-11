import type { Metadata } from "next";
import { QuizStepper } from "@/components/quiz/QuizStepper";

export const metadata: Metadata = {
  title: "Free Metabolic Profile Quiz | InsulinIQ",
  description:
    "8 questions. Understand your metabolic health and get personalised recipe recommendations based on your region, symptoms, and lifestyle.",
};

// Thin server wrapper — all quiz state lives in the client QuizStepper component.
export default function QuizPage() {
  return (
    <div className="py-12 md:py-20 px-4">
      <QuizStepper />
    </div>
  );
}
