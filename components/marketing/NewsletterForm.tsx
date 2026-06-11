"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-white text-forest-800 hover:bg-forest-50 font-semibold whitespace-nowrap px-6 h-12 rounded-xl shadow-sm transition-all hover:-translate-y-px disabled:opacity-60"
    >
      {pending ? "Subscribing…" : "Get Free Tips"}
    </Button>
  );
}

export function NewsletterForm() {
  const [, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    startTransition(async () => {
      await subscribeToNewsletter(formData);
    });
  }

  return (
    <section className="bg-gradient-to-br from-forest-800 to-forest-900 py-20 md:py-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-forest-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sage-800/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-700 mb-6">
          <Mail className="h-6 w-6 text-forest-300" />
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Weekly metabolic health tips — free
        </h2>
        <p className="mt-4 text-forest-200 text-lg leading-relaxed">
          Join early readers building better metabolic health — one insight at a
          time. No spam, unsubscribe anytime.
        </p>

        <form
          action={handleAction}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-forest-300 focus:bg-white/20 focus:border-forest-400 h-12 rounded-xl flex-1 text-base"
          />
          <SubmitButton />
        </form>

        <p className="mt-4 text-xs text-forest-400">
          Educational purposes only. Not medical advice. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
