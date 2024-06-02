import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  // check if user is logged in
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
};

export default function SignOut() {
  return null;
}
