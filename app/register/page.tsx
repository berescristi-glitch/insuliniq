"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-forest-600 hover:bg-forest-700 text-white h-11 font-semibold rounded-xl"
    >
      {pending ? "Creating account…" : "Create free account"}
    </Button>
  );
}

function CheckboxField({
  name,
  required = false,
  children,
}: {
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        value="on"
        required={required}
        defaultChecked={false}
        className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border text-forest-600 focus:ring-forest-500 focus:ring-2 cursor-pointer"
      />
      <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
        {children}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
    </label>
  );
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Check your inbox</h2>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a confirmation link to your email. Click it to activate your account.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Can&apos;t find it? Check your spam folder.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-forest-600 font-semibold hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">IQ</span>
            </div>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free access to evidence-based metabolic health education
          </p>
        </div>

        <form action={handleAction} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1.5">
              Full name
            </label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Smith"
              className="h-11 rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="h-11 rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
              <span className="ml-1 text-xs text-muted-foreground font-normal">(min. 8 characters)</span>
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-foreground mb-1.5">
              Confirm password
            </label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Legal consent — all unchecked by default (GDPR requirement) */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-4 space-y-3">
            <CheckboxField name="terms_accepted" required>
              I have read and agree to the{" "}
              <Link href="/legal/terms" className="text-forest-600 hover:underline font-medium" target="_blank">
                Terms of Use
              </Link>
            </CheckboxField>

            <CheckboxField name="privacy_accepted" required>
              I have read and accept the{" "}
              <Link href="/legal/privacy" className="text-forest-600 hover:underline font-medium" target="_blank">
                Privacy Policy
              </Link>
              , including how my data is processed
            </CheckboxField>

            <CheckboxField name="age_confirmed" required>
              I confirm I am <strong className="text-foreground">16 years of age or older</strong>{" "}
              (13+ if you are located in the United States)
            </CheckboxField>

            <div className="border-t border-border pt-3">
              <CheckboxField name="newsletter_opt_in">
                I would like to receive educational updates and metabolic health tips by email.
                You can unsubscribe at any time.
              </CheckboxField>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <SubmitButton />

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            InsulinIQ provides educational content only — not medical advice.{" "}
            <Link href="/legal/disclaimer" className="underline hover:text-foreground">
              Medical Disclaimer
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-forest-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
