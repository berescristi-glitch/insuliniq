import { AlertCircle } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <aside className="mt-10 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3">
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
      <p className="text-sm text-amber-800">
        <strong>Medical Disclaimer:</strong> This content is for educational
        purposes only and does not constitute medical advice. Always consult a
        qualified healthcare provider before making changes to your diet,
        exercise routine, or treatment plan.
      </p>
    </aside>
  );
}
