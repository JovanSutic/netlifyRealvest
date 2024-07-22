import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { supabaseClient, headers } = createSupabaseServerClient(request);
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
    console.log(error);
  }
};

export default function SignOut() {
  return null;
}
