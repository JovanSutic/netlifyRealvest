import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseFrontendClient() {
  return createBrowserClient(
    process.env.SUPABASE_URL_LOCAL!,
    process.env.SUPABASE_KEY_LOCAL!,
  );
}