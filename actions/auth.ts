"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const RegisterSchema = z
  .object({
    full_name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    terms_accepted: z.literal("on", {
      errorMap: () => ({ message: "You must accept the Terms of Use to continue" }),
    }),
    privacy_accepted: z.literal("on", {
      errorMap: () => ({ message: "You must accept the Privacy Policy to continue" }),
    }),
    age_confirmed: z.literal("on", {
      errorMap: () => ({ message: "You must confirm you are 16 years of age or older" }),
    }),
    newsletter_opt_in: z.enum(["on", "off"]).optional(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/");
}

export async function registerAction(formData: FormData) {
  const parsed = RegisterSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    terms_accepted: formData.get("terms_accepted"),
    privacy_accepted: formData.get("privacy_accepted"),
    age_confirmed: formData.get("age_confirmed"),
    newsletter_opt_in: formData.get("newsletter_opt_in") ?? "off",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { full_name, email, password, newsletter_opt_in } = parsed.data;
  const now = new Date().toISOString();
  const newsletterOn = newsletter_opt_in === "on";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        terms_accepted_at: now,
        privacy_accepted_at: now,
        age_confirmed_at: now,
        newsletter_opt_in: newsletterOn,
        newsletter_opt_in_at: newsletterOn ? now : null,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
