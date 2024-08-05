import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { FinalError } from "../types/component.types";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    await supabaseClient.auth.getUser();
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session?.user) {
      return redirect(`/auth?lang=${lang}`, {
        headers,
      });
    }
    // sign out
    await supabaseClient.auth.signOut();
    return redirect(`/auth?lang=${lang}`, {
      headers,
    });
  } catch (error) {
    isError = true;
    finalError = error as FinalError;
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return null;
};

export default function SignOut() {
  return null;
}
