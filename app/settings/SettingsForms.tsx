"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction, updatePasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SaveButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-forest-600 hover:bg-forest-700 text-white h-10 font-semibold rounded-xl"
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function ProfileForm({ fullName }: { fullName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result?.error) setError(result.error);
      else if (result?.success) setSuccess(true);
    });
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1.5">
          Full name
        </label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={fullName}
          className="h-11 rounded-xl max-w-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 max-w-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-forest-700 bg-forest-50 border border-forest-100 rounded-lg px-3 py-2 max-w-sm">
          Profile updated.
        </p>
      )}

      <SaveButton label="Save changes" pendingLabel="Saving…" />
    </form>
  );
}

export function PasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result?.error) setError(result.error);
      else if (result?.success) setSuccess(true);
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
          className="h-11 rounded-xl max-w-sm"
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
          className="h-11 rounded-xl max-w-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 max-w-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-forest-700 bg-forest-50 border border-forest-100 rounded-lg px-3 py-2 max-w-sm">
          Password updated.
        </p>
      )}

      <SaveButton label="Update password" pendingLabel="Updating…" />
    </form>
  );
}
