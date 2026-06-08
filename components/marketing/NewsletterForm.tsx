"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
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
    <section className="bg-emerald-700 py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Weekly metabolic health tips — free
        </h2>
        <p className="mt-3 text-emerald-200">
          Join 10,000+ readers learning to reverse insulin resistance naturally.
          No spam, unsubscribe anytime.
        </p>

        <form action={handleAction} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 flex-1"
          />
          <SubmitButton />
        </form>

        <p className="mt-3 text-xs text-emerald-300">
          This content is for educational purposes only and does not constitute
          medical advice. Always consult a qualified healthcare provider.
        </p>
      </div>
    </section>
  );
}
