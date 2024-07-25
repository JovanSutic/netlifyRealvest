import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/auth";
  const headers = new Headers();

  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    try {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (!error) {
        return redirect(next, { headers });
      }
    } catch (error) {
      return redirect(`/?code=${code}`, { headers });
    }
   
  }

  // return the user to an error page with instructions
  return redirect("/", { headers });
}
