import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { FinalError } from "../types/component.types";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const lang = requestUrl.searchParams.get("lang") || "sr";
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/auth";

  let isError = false;
  let finalError: FinalError | null = null;

  if (code) {
    const { supabaseClient, headers } = createSupabaseServerClient(request);

    try {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (!error) {
        return redirect(next, { headers });
      }
    } catch (error) {
      isError = true;
      finalError = error as FinalError;
    }
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return redirect("/");
}
