import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/auth";
  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(request);

    try {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (!error) {
        return redirect(next, { headers });
      }
    } catch (error) {
      console.log(error);
    }
  }

 
  return redirect("/");
}
