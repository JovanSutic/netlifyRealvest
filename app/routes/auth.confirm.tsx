import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { FinalError } from "../types/component.types";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const headers = new Headers();

  let isError = false;
  let finalError: FinalError | null = null;

  if (token_hash && type) {
    const supabase = createServerClient(
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
      }
    );

    try {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        return redirect(`/offer/?lang=${lang}`, { headers });
      }
    } catch (error) {
      isError = true;
      finalError = error as FinalError;
    }
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  // return the user to an error page with instructions
  return redirect("/", { headers });
}
