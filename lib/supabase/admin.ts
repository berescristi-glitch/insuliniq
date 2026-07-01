import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Strips BOM (U+FEFF, value 65279) that Windows clipboard / some editors prepend.
// Without this, the Supabase JWT Authorization header throws:
//   TypeError: Cannot convert argument to a ByteString because the character
//   at index 0 has a value of 65279 which is greater than 255.
function sanitizeKey(raw: string | undefined): string | undefined {
  return raw?.replace(/^﻿/, "").trim() || undefined;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const serviceKey = sanitizeKey(rawKey);

if (!serviceKey) {
  // Log at module-load time so the error appears in the first relevant request log.
  // Never log the key value — only its presence/absence.
  console.error(
    "[supabase-admin] Missing or invalid SUPABASE_SERVICE_ROLE_KEY. " +
    "Admin operations (newsletter, analytics, webhooks, cron) will fail. " +
    "Check Vercel env vars — the key must not contain a BOM character (U+FEFF)."
  );
}

// Returns a service-role Supabase client that bypasses RLS.
// Use ONLY in server-side code: Server Actions, Route Handlers, Server Components.
// Never expose this client or its key to the browser.
export function getAdminClient() {
  return createClient<Database>(url!, serviceKey ?? "", {
    auth: { persistSession: false },
  });
}