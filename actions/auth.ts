"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/resend/emails";

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

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const PasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const UpdateProfileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
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
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "Please confirm your email before signing in. Check your inbox for the confirmation link we sent when you registered.",
      };
    }
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
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

  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        error: "An account with this email already exists. Try signing in instead.",
      };
    }
    return { error: error.message };
  }

  if (newsletterOn) {
    const { error: nlError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source: "registration" });

    // 23505 = duplicate email — already subscribed, skip silently
    if (!nlError || nlError.code === "23505") {
      sendConfirmationEmail(email).catch((err) =>
        console.error("Newsletter confirmation email failed:", err)
      );
    } else {
      console.error("Newsletter insert error during registration:", nlError);
    }
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  // Always report success — don't reveal whether the email is registered
  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = PasswordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = PasswordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateProfileAction(formData: FormData) {
  const parsed = UpdateProfileSchema.safeParse({
    full_name: formData.get("full_name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: parsed.data.full_name },
  });

  if (authError) {
    return { error: authError.message };
  }

  const { error: dbError } = await supabase
    .from("users")
    .update({ full_name: parsed.data.full_name })
    .eq("id", user.id);

  if (dbError) {
    return { error: dbError.message };
  }

  return { success: true };
}
