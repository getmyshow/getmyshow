import { createClient } from "@supabase/supabase-js";

/**
 * Service Role client with full privileges for Server Actions, Order Creation, and Webhooks.
 * NEVER IMPORT ON THE CLIENT!
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase admin service credentials");
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

