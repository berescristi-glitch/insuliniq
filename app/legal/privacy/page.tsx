import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | InsulinIQ",
  description:
    "How InsulinIQ collects, uses, and protects your personal data. Covers GDPR (UK/EU), Australian Privacy Act, and US requirements.",
};

const SECTION = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-forest-100">
          <Lock className="h-6 w-6 text-forest-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Legal</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 2026 · Covers US · UK · Australia
          </p>
        </div>
      </div>

      <div className="space-y-10 text-[1.0625rem] leading-[1.85] text-foreground/80">

        <section>
          <p>
            InsulinIQ (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
            is committed to protecting your privacy. This policy explains what
            personal data we collect, why we collect it, how we use it, and what
            rights you have. It applies to users in the United States, United
            Kingdom, and Australia.
          </p>
          <p className="mt-4">
            By using InsulinIQ, you agree to the collection and use of your data
            as described in this policy.
          </p>
        </section>

        <SECTION title="1. Who We Are">
          <p>
            InsulinIQ is an educational platform about metabolic health. Our
            registered contact address and data controller details are available
            on request at{" "}
            <a href="mailto:hello@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              hello@insuliniq.com
            </a>
            .
          </p>
        </SECTION>

        <SECTION title="2. Data We Collect">
          <p>We collect the following categories of data:</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/60">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Data</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Why we collect it</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Email address", "Account creation, transactional emails, newsletter (if opted in)"],
                  ["Quiz responses", "To provide your personalised metabolic profile results"],
                  ["Subscription status", "To manage your access to paid features"],
                  ["Usage data (pages visited, time on site)", "Anonymous analytics via Plausible — no personal identifiers"],
                  ["IP address", "Security, fraud prevention, and rough geographic analytics"],
                  ["AI assistant conversations", "To generate responses within your session; not stored long-term"],
                ].map(([data, reason], i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground/90">{data}</td>
                    <td className="px-5 py-3">{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            We do not collect sensitive health data (such as medical records,
            diagnoses, or prescription information). Quiz responses are
            self-reported lifestyle and symptom data, not medical records.
          </p>
        </SECTION>

        <SECTION title="3. How We Use Your Data">
          <p>We use your data to:</p>
          <ul className="space-y-2">
            {[
              "Provide and personalise your experience on InsulinIQ",
              "Send transactional emails (account confirmation, subscription receipts) via Resend",
              "Send educational newsletters if you have opted in (you can unsubscribe at any time)",
              "Process and manage your subscription via Lemon Squeezy",
              "Improve our content and platform based on aggregated, anonymised analytics",
              "Detect and prevent fraud or abuse",
              "Comply with legal obligations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            We do not sell your personal data to third parties. We do not use
            your data for advertising platforms (such as Facebook Pixel or Google
            Ads remarketing).
          </p>
        </SECTION>

        <SECTION title="4. Third-Party Services">
          <p>
            We work with the following third-party services that may process
            your data on our behalf:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              {
                name: "Supabase",
                role: "Database and authentication provider. Stores your account data and quiz results securely in the EU.",
              },
              {
                name: "Lemon Squeezy",
                role: "Merchant of Record for all payments. Lemon Squeezy processes and stores payment card data directly — we never see or store your payment details. Their privacy policy governs payment data.",
              },
              {
                name: "Resend",
                role: "Transactional email delivery. Your email address is shared with Resend solely to deliver emails you have requested or that are required for your account.",
              },
              {
                name: "Plausible Analytics",
                role: "Privacy-first website analytics. Plausible does not use cookies, does not track individuals across sites, and does not collect personal identifiers. It is GDPR-compliant by design.",
              },
              {
                name: "Vercel",
                role: "Hosting and content delivery. Vercel may process request data (IP addresses, headers) as part of serving the platform.",
              },
            ].map((s, i) => (
              <li key={i} className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="mt-1 text-sm">{s.role}</p>
              </li>
            ))}
          </ul>
        </SECTION>

        <SECTION title="5. Cookies">
          <p>
            InsulinIQ uses a minimal number of cookies:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              "Authentication cookies — set by Supabase to keep you logged in. These are strictly necessary and cannot be disabled without affecting functionality.",
              "No advertising or tracking cookies are set by InsulinIQ. We use Plausible Analytics, which does not use cookies.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.6rem] h-2 w-2 flex-shrink-0 rounded-full bg-forest-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SECTION>

        <SECTION title="6. Data Retention">
          <p>
            We retain your personal data for as long as your account is active
            or as needed to provide services. If you close your account, we will
            delete your personal data within 30 days, except where we are
            required by law to retain it for longer (for example, financial
            records related to subscription payments are retained for 7 years in
            line with UK and Australian tax regulations).
          </p>
          <p>
            Anonymous, aggregated analytics data is retained indefinitely as it
            cannot be linked to any individual.
          </p>
        </SECTION>

        <SECTION title="7. Your Rights">
          <p>
            Depending on your location, you have the following rights regarding
            your personal data:
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/60">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Right</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">UK / EU (GDPR)</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">Australia (Privacy Act)</th>
                  <th className="px-5 py-3 text-left font-semibold text-muted-foreground">US (state laws vary)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Access your data", "✓", "✓", "✓ (CA, CO, VA, TX, others)"],
                  ["Correct inaccurate data", "✓", "✓", "✓"],
                  ["Delete your data", "✓", "✓", "✓ (CA, CO, others)"],
                  ["Object to processing", "✓", "Partial", "Partial"],
                  ["Data portability", "✓", "—", "Partial"],
                  ["Withdraw consent", "✓", "✓", "✓"],
                ].map(([right, uk, aus, us], i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground/90">{right}</td>
                    <td className="px-5 py-3">{uk}</td>
                    <td className="px-5 py-3">{aus}</td>
                    <td className="px-5 py-3">{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              privacy@insuliniq.com
            </a>
            . We will respond within 30 days (UK GDPR requirement) or as
            required by applicable law.
          </p>
          <p className="mt-4">
            UK residents may also lodge a complaint with the{" "}
            <strong>Information Commissioner&apos;s Office (ICO)</strong> at
            ico.org.uk. Australian residents may contact the{" "}
            <strong>Office of the Australian Information Commissioner (OAIC)</strong>{" "}
            at oaic.gov.au.
          </p>
        </SECTION>

        <SECTION title="8. International Data Transfers">
          <p>
            Your data may be stored or processed in countries outside your own —
            including the United States, where Supabase, Lemon Squeezy, and
            Resend are based. Where required by law (e.g. UK GDPR), we ensure
            appropriate safeguards are in place for such transfers, including
            Standard Contractual Clauses where applicable.
          </p>
        </SECTION>

        <SECTION title="9. Children's Privacy">
          <p>
            InsulinIQ is not directed at children under the age of 16 (or 13 in
            the United States). We do not knowingly collect personal data from
            children. If you believe a child has provided us with personal data,
            please contact us immediately at{" "}
            <a href="mailto:privacy@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              privacy@insuliniq.com
            </a>
            .
          </p>
        </SECTION>

        <SECTION title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify
            registered users of material changes by email. The &ldquo;last
            updated&rdquo; date at the top of this page reflects when the policy
            was last revised. Continued use of InsulinIQ after changes are
            published constitutes acceptance of the updated policy.
          </p>
        </SECTION>

        <SECTION title="11. Contact">
          <p>
            For any privacy-related questions, data requests, or complaints,
            contact us at{" "}
            <a href="mailto:privacy@insuliniq.com" className="font-medium text-forest-600 underline decoration-forest-200 underline-offset-2 hover:text-forest-800">
              privacy@insuliniq.com
            </a>
            .
          </p>
        </SECTION>

      </div>
    </article>
  );
}
