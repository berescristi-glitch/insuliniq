import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-bold text-emerald-700">
              InsulinIQ
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Science-backed education on insulin resistance, PCOS, NAFLD, and
              metabolic health.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Learn
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/learn", label: "All Articles" },
                { href: "/pcos", label: "PCOS Hub" },
                { href: "/prediabetes", label: "Prediabetes" },
                { href: "/nafld", label: "NAFLD/MASLD" },
                { href: "/obesity", label: "Obesity" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 hover:text-emerald-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Tools
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/quiz", label: "Free Quiz" },
                { href: "/recipes", label: "Recipes" },
                { href: "/meal-plans", label: "Meal Plans" },
                { href: "/ai-assistant", label: "AI Assistant" },
                { href: "/community", label: "Community" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 hover:text-emerald-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/legal/disclaimer", label: "Medical Disclaimer" },
                { href: "/legal/privacy", label: "Privacy Policy" },
                { href: "/legal/terms", label: "Terms of Use" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 hover:text-emerald-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto text-center">
            <strong className="text-gray-600">Educational Disclaimer:</strong> InsulinIQ provides digital educational content,
            nutrition frameworks, and self-assessment tools for general health information purposes only. The information,
            products, and services offered here are not intended to diagnose, treat, cure, or prevent any medical condition,
            nor do they replace a face-to-face consultation with a licensed healthcare provider. Never disregard professional
            medical advice or delay seeking it because of something you read on this website. Nutritional modifications should
            be undertaken in consultation with your primary physician or endocrinologist.
          </p>
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} InsulinIQ. All rights reserved. Educational content only — not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
