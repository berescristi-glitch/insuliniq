import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Link expired</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block text-sm text-forest-600 font-semibold hover:underline"
          >
            Request a new link
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
          <h1 className="text-2xl font-extrabold text-foreground">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a new password for your account
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
