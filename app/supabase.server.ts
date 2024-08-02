import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const createSupabaseServerClient = (request: Request) => {
  const headers = new Headers();
  // const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL_LOCAL!,
    process.env.SUPABASE_KEY_LOCAL!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (value === "" && name.includes("auth-token-code-verifier")) {
              // console.log("sad bi obrisao verifier");
            } else {
              headers.append(
                "Set-Cookie",
                serializeCookieHeader(name, value, options)
              );
            }
          });
        },
      },
      auth: {
        detectSessionInUrl: true,
        flowType: "pkce",
        persistSession: true,
      },
    }
  );
  return { supabaseClient, headers };
};
