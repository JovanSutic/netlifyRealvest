import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { SupportedStorage } from "@supabase/supabase-js";

const customStorageAdapter: SupportedStorage = {
  getItem: (key) => {
    // if (!supportsLocalStorage()) {
    //     // Configure alternate storage
    //     return null
    // }
    return globalThis.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    // if (!supportsLocalStorage()) {
    //     // Configure alternate storage here
    //     return
    // }
    globalThis.localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    // if (!supportsLocalStorage()) {
    //     // Configure alternate storage here
    //     return
    // }
    globalThis.localStorage.removeItem(key);
  },
};

export const createSupabaseServerClient = (request: Request) => {
  const headers = new Headers();
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL_LOCAL!,
    process.env.SUPABASE_KEY_LOCAL!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
      auth: {
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: customStorageAdapter,
      },
    }
  );
  return { supabaseClient, headers };
};
