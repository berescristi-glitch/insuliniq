import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Use | InsulinIQ",
  description:
    "InsulinIQ Terms of Use — covering access, subscriptions, cancellation rights, and limitations of liability for US, UK, and Australian users.",
};

const SECTION = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-forest-100">
          <FileText className="h-6 w-6 text-forest-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Legal</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 2026 · Covers US · UK · Australia
          </p>
        </div>
      </div>

      <div className="space-y-10 text-[1.0625rem] leading-[1.85] text-foreground/80">

        <section>
          <p>
            These Terms of Use govern your access to and use of InsulinIQ
            (&ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
            accessing or purchasing from InsulinIQ, you agree to these terms. If
            you do not agree, please do not use the Platform.
          </p>
        </section>

        <SECTION title="1. What InsulinIQ Is">
          <p>
            InsulinIQ is an educational platform providing information about
            metabolic health, including insulin resistance, PCOS, NAFLD/MASLD,
            prediabetes, obesity, and metabolic syndrome. All content — articles,
            recipes, meal plans, quiz results, and AI assistant responses — is
            for educational purposes only and does not constitute medical advice.
            See our{" "}
            <a href="/legal/disclaimer" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              Medical Disclaimer
            </a>{" "}
            for full details.
          </p>
          <p>
            InsulinIQ is not a healthcare provider, medical practice, or
            regulated medical device. Use of this Platform does not create a
            doctor-patient or dietitian-client relationship of any kind.
          </p>
        </SECTION>

        <SECTION title="2. Eligibility">
          <p>
            You must be at least 16 years old (or 13 in the United States) to
            create an account on InsulinIQ. By agreeing to these terms, you
            confirm that you meet this requirement. If you are accessing InsulinIQ
            on behalf of a minor, you accept these terms on their behalf and are
            responsible for their use of the Platform.
          </p>
        </SECTION>

        <SECTION title="3. Account Responsibilities">
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. You agree to notify us immediately at{" "}
            <a href="mailto:hello@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              hello@insuliniq.com
            </a>{" "}
            if you suspect unauthorised use of your account. You are responsible
            for all activity that occurs under your account.
          </p>
        </SECTION>

        <SECTION title="4. Subscriptions and Payments">
          <p>
            InsulinIQ offers both one-time purchases and recurring monthly
            subscriptions. All payments are processed by{" "}
            <strong>Lemon Squeezy</strong>, which acts as the{" "}
            <strong>Merchant of Record</strong> for all transactions. This means
            your purchase is made with Lemon Squeezy, and their terms of service
            and privacy policy govern the payment transaction itself.
          </p>
          <p>
            Current subscription plans include Basic, Premium, and Community
            tiers, billed monthly. Prices are displayed at checkout in USD, GBP,
            or AUD depending on your region. All prices include applicable taxes
            where required by law.
          </p>
          <p>
            Subscriptions renew automatically at the end of each billing period
            unless cancelled before the renewal date.
          </p>
        </SECTION>

        <SECTION title="5. Cancellation and Refunds">

          <h3 className="mt-2 text-base font-semibold text-foreground">All users</h3>
          <p>
            You may cancel your subscription at any time through your account
            settings or by contacting us at{" "}
            <a href="mailto:hello@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              hello@insuliniq.com
            </a>
            . Cancellation takes effect at the end of the current billing period.
            You will retain access to paid features until then.
          </p>
          <p>
            We offer a <strong>30-day money-back guarantee</strong> on all
            subscription plans. If you are not satisfied within the first 30
            days of a new subscription, contact us for a full refund — no
            questions asked.
          </p>

          <div className="rounded-2xl border border-sage-200 bg-sage-50 p-5">
            <h3 className="font-semibold text-sage-800">UK Consumers — Cooling-Off Period</h3>
            <p className="mt-2 text-sm text-sage-700">
              Under the Consumer Contracts (Information, Cancellation and
              Additional Charges) Regulations 2013, you have the right to cancel
              a subscription within <strong>14 days</strong> of your initial
              purchase (&ldquo;cooling-off period&rdquo;) without giving any
              reason. To exercise this right, contact us at{" "}
              <a href="mailto:hello@insuliniq.com" className="text-sage-800 underline">
                hello@insuliniq.com
              </a>{" "}
              within 14 days of your purchase date. A full refund will be
              processed within 14 calendar days. Note: if you explicitly request
              immediate access to digital content during the cooling-off period
              (which is the default for InsulinIQ), you acknowledge that your
              right to cancel may be affected once the content has been fully
              consumed. Our 30-day money-back guarantee offers broader protection
              than the statutory minimum in any case.
            </p>
          </div>

          <div className="rounded-2xl border border-honey-200 bg-honey-50 p-5">
            <h3 className="font-semibold text-honey-800">Australian Consumers — Consumer Guarantees</h3>
            <p className="mt-2 text-sm text-honey-700">
              Under the Australian Consumer Law (ACL), you are entitled to
              consumer guarantees for services. If InsulinIQ fails to deliver a
              service that is fit for purpose, of acceptable quality, or
              corresponds to its description, you may be entitled to a remedy
              including a refund. These statutory rights are in addition to our
              30-day money-back guarantee and are not excluded, restricted, or
              modified by these Terms. To make a claim under consumer guarantees,
              contact{" "}
              <a href="mailto:hello@insuliniq.com" className="text-honey-800 underline">
                hello@insuliniq.com
              </a>
              .
            </p>
          </div>

        </SECTION>

        <SECTION title="6. Acceptable Use">
          <p>You agree not to use InsulinIQ to:</p>
          <ul className="space-y-2">
            {[
              "Violate any applicable law or regulation",
              "Provide false information when creating an account",
              "Attempt to gain unauthorised access to any part of the Platform or its infrastructure",
              "Scrape, reproduce, or redistribute content from InsulinIQ without written permission",
              "Use the AI assistant to generate content that could harm other users",
              "Impersonate any person or entity",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms.
          </p>
        </SECTION>

        <SECTION title="7. Intellectual Property">
          <p>
            All content on InsulinIQ — including articles, recipes, meal plans,
            images, software, and the compilation of all such content — is owned
            by or licensed to InsulinIQ and is protected by applicable copyright
            and intellectual property laws. You may not reproduce, distribute,
            modify, or create derivative works from any content without our
            express written consent.
          </p>
          <p>
            Personal use is permitted: you may print or save content for your own
            non-commercial educational use.
          </p>
        </SECTION>

        <SECTION title="8. AI Assistant Terms">
          <p>
            InsulinIQ&apos;s AI assistant is an educational tool. By using the
            assistant, you agree that:
          </p>
          <ul className="space-y-2">
            {[
              "You will not attempt to extract medical diagnoses, treatment plans, or medication advice from the assistant.",
              "You will not attempt to override the assistant's safety guidelines through prompt manipulation or roleplay scenarios.",
              "You will not use assistant outputs as a substitute for professional medical advice.",
              "Conversations with the assistant are not confidential in the same sense as a doctor-patient communication.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SECTION>

        <SECTION title="9. Disclaimer of Warranties">
          <p>
            InsulinIQ is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranties of any kind, either express or
            implied, including but not limited to implied warranties of
            merchantability, fitness for a particular purpose, or
            non-infringement. We do not warrant that the Platform will be
            uninterrupted, error-free, or free of harmful components.
          </p>
          <p>
            <strong>For Australian consumers:</strong> Nothing in this clause
            excludes, restricts, or modifies any right or remedy, or any
            guarantee, warranty, or other term or condition, implied or imposed
            by the Australian Consumer Law that cannot be excluded.
          </p>
        </SECTION>

        <SECTION title="10. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, InsulinIQ and its
            operators shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Platform, including any reliance on content or AI assistant outputs
            for health decisions.
          </p>
          <p>
            Our total liability for any claim arising from these Terms or your
            use of InsulinIQ shall not exceed the amount you paid to us in the
            12 months preceding the claim.
          </p>
        </SECTION>

        <SECTION title="11. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the
            laws of the jurisdiction in which InsulinIQ is registered. However:
          </p>
          <ul className="space-y-2">
            {[
              "UK users retain the benefit of mandatory consumer protections under English law and the Consumer Rights Act 2015.",
              "Australian users retain the benefit of mandatory consumer protections under the Australian Consumer Law.",
              "US users in states with specific consumer protection laws retain those protections.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SECTION>

        <SECTION title="12. Changes to These Terms">
          <p>
            We may update these Terms of Use from time to time. We will notify
            registered users of material changes by email at least 14 days
            before the changes take effect (30 days for subscription-related
            changes). Continued use of InsulinIQ after the effective date
            constitutes acceptance of the updated Terms.
          </p>
        </SECTION>

        <SECTION title="13. Contact">
          <p>
            Questions about these Terms? Contact us at{" "}
            <a href="mailto:hello@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              hello@insuliniq.com
            </a>
            .
          </p>
        </SECTION>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          ⚠️ These Terms were drafted for general guidance covering US, UK
          (Consumer Rights Act 2015, Consumer Contracts Regulations 2013), and
          Australian (ACL) requirements. Have a qualified lawyer in each of your
          target jurisdictions review them before publishing.
        </div>

      </div>
    </article>
  );
}
