"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/actions/auth";
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
      {pending ? "Updating…" : "Update password"}
    </Button>
  );
}

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await resetPasswordAction(formData);
        if (result?.error) setError(result.error);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
          New password
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
          Confirm new password
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

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
