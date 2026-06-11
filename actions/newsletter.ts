"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/resend/emails";

const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function subscribeToNewsletter(formData: FormData) {
  const raw = { email: formData.get("email") };
  const parsed = EmailSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;

  const supabase = await createClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source: "homepage" });

  if (error) {
    // Duplicate email — silently succeed to avoid enumeration
    if (error.code === "23505") {
      return { success: true };
    }
    console.error("Newsletter insert error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  await sendConfirmationEmail(email);

  return { success: true };
}
