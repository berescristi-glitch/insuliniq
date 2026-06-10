import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Medical Disclaimer | InsulinIQ",
  description:
    "InsulinIQ provides educational content only. Read our medical disclaimer to understand the scope and limitations of the information on this platform.",
};

export default function MedicalDisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-forest-100">
          <ShieldCheck className="h-6 w-6 text-forest-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Legal</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Medical Disclaimer
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 2026
          </p>
        </div>
      </div>

      <div className="space-y-10 text-[1.0625rem] leading-[1.85] text-foreground/80">

        {/* Core disclaimer */}
        <section>
          <div className="rounded-2xl border border-forest-200 bg-forest-50 p-6">
            <p className="font-semibold text-forest-800">
              InsulinIQ is an educational platform. The content published here —
              including articles, recipes, meal plans, quiz results, and AI
              assistant responses — is for informational and educational purposes
              only. It does not constitute medical advice, diagnosis, or
              treatment.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Not a Substitute for Professional Medical Care</h2>
          <p>
            Nothing on InsulinIQ creates or is intended to create a
            doctor-patient relationship. The information provided is based on
            publicly available peer-reviewed research and general educational
            principles. It is not personalised to your individual medical
            history, current medications, or specific health circumstances.
          </p>
          <p className="mt-4">
            Always consult a qualified healthcare professional — such as your
            general practitioner, physician, endocrinologist, or registered
            dietitian — before making changes to your diet, exercise routine,
            medication, or any other aspect of your health management. If you
            are unsure whether any information on this platform applies to your
            situation, ask your doctor first.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Emergency Situations</h2>
          <div className="rounded-2xl border border-clay-200 bg-clay-50 p-5">
            <p className="font-medium text-clay-800">
              If you are experiencing a medical emergency, do not use this
              platform. Contact emergency services immediately:
            </p>
            <ul className="mt-3 space-y-1 text-clay-700">
              <li><strong>United States:</strong> Call 911</li>
              <li><strong>United Kingdom:</strong> Call 999 or 111 (non-emergency)</li>
              <li><strong>Australia:</strong> Call 000</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Scope of Educational Content</h2>
          <p>
            The articles, guides, and resources on InsulinIQ are written to help
            people understand metabolic health topics — including insulin
            resistance, PCOS, NAFLD/MASLD, prediabetes, obesity, and metabolic
            syndrome — at a general, population-level. This content:
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Is based on peer-reviewed research available at the time of writing and may not reflect the most recent clinical guidelines.",
              "May not apply to your individual circumstances, particularly if you have other medical conditions, take specific medications, or are pregnant or breastfeeding.",
              "Does not account for individual variability in how people respond to diet, exercise, or lifestyle changes.",
              "Should not be used to self-diagnose any condition.",
              "Should not be used to start, stop, or change any medication or treatment without consulting a qualified healthcare provider.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">AI Assistant</h2>
          <p>
            InsulinIQ includes an AI-powered educational assistant. This assistant
            is designed to help users understand metabolic health topics and
            prepare questions for conversations with their healthcare providers.
            It is <strong>not a medical device</strong> and is not approved,
            certified, or regulated as one in any jurisdiction.
          </p>
          <p className="mt-4">
            The AI assistant will not provide individual diagnoses, advise on
            starting or stopping medications, or generate personalised treatment
            plans. If you ask it questions outside these boundaries, it is
            designed to redirect you to appropriate professional support. However,
            AI systems can make errors. Do not rely solely on AI assistant
            responses for any health-related decision.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Weight, Eating, and Vulnerable Readers</h2>
          <p>
            Some content on InsulinIQ discusses body weight, food, and metabolic
            markers. This content is intended to be read in the context of
            metabolic health education, not as guidance on restriction, weight
            loss as a goal in itself, or dietary control. If you have, or
            suspect you may have, a difficult relationship with food or eating,
            please speak with a healthcare professional or a registered dietitian
            before acting on any nutritional content on this platform.
          </p>
          <p className="mt-4">
            InsulinIQ is not a treatment resource for eating disorders. If you
            need support:
          </p>
          <ul className="mt-3 space-y-1">
            <li><strong>US:</strong> National Eating Disorders Association (NEDA) Helpline: 1-800-931-2237</li>
            <li><strong>UK:</strong> Beat Eating Disorders: 0808 801 0677</li>
            <li><strong>Australia:</strong> Butterfly Foundation: 1800 33 4673</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Accuracy and Currency of Information</h2>
          <p>
            InsulinIQ makes reasonable efforts to ensure the accuracy of
            published content at the time of writing. However, medical and
            nutritional science evolves continuously. Content may become
            outdated as new research emerges. We do not guarantee that all
            information is current, complete, or free of error.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, InsulinIQ and its
            operators, authors, and contributors shall not be liable for any
            health outcome, loss, or damage resulting from reliance on the
            educational content, tools, or AI assistant available on this
            platform. Your use of this platform is at your own discretion and
            risk.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Contact</h2>
          <p>
            If you have questions about this disclaimer or about the
            appropriateness of any specific content for your situation, please
            contact us at{" "}
            <a href="mailto:hello@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              hello@insuliniq.com
            </a>
            .
          </p>
        </section>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          ⚠️ This disclaimer was drafted for general guidance. Have a qualified
          lawyer in each of your target jurisdictions (US, UK, AUS) review it
          before publishing.
        </div>

      </div>
    </article>
  );
}
