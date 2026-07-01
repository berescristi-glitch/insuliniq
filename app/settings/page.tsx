import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm, PasswordForm } from "./SettingsForms";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-foreground mb-10">Account settings</h1>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground mb-5">{user.email}</p>
        <ProfileForm fullName={fullName} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-lg font-bold text-foreground mb-1">Password</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Choose a strong password you don&apos;t use elsewhere.
        </p>
        <PasswordForm />
      </section>
    </div>
  );
}
