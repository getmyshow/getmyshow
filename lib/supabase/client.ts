import { createClient } from "@supabase/supabase-js";

/**
 * Public browser client for reading events and public pass verifications.
 * Safe for use in Client Components.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  return createClient(url, anonKey);
}

