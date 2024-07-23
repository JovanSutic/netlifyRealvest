import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient, parse, serialize } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const headers = new Headers();

  if (token_hash && type) {
    const cookies = parse(request.headers.get("Cookie") ?? "");

    const supabase = createServerClient(
      process.env.SUPABASE_URL_LOCAL!,
      process.env.SUPABASE_KEY_LOCAL!,
      {
        cookies: {
          get(key) {
            return cookies[key];
          },
          set(key, value, options) {
            headers.append("Set-Cookie", serialize(key, value, options));
          },
          remove(key, options) {
            headers.append("Set-Cookie", serialize(key, "", options));
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
        return redirect(`/dashboard/search?lang=${lang}`, { headers });
      }
  
    } catch (error) {
      console.log(error);
    }

  }

  // return the user to an error page with instructions
  return redirect("/", { headers });
}
