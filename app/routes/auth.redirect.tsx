import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { authCookie, refreshCookie } from "../utils/cookies";
import { FinalError } from "../types/component.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const code = new URL(request.url).searchParams.get("code");

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    const { data, error: sessionError } =
      await supabaseClient.auth.exchangeCodeForSession(code!);
    if (sessionError) {
      isError = true;
      finalError = sessionError as FinalError;
    }

    if (data) {
      headers.append(
        "Set-Cookie",
        await authCookie.serialize(data.session?.access_token)
      );
      headers.append(
        "Set-Cookie",
        await refreshCookie.serialize(data.session?.refresh_token)
      );

      return redirect(`/auth/update_password/?lang=${lang}`, {
        headers,
      });
    }

    const user = await supabaseClient.auth.getUser();

    if (user?.data?.user?.role === "authenticated") {
      return redirect(`/market?page=1&lang=${lang}`);
    }
  } catch (error) {
    isError = true;
    finalError = error as FinalError;
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return null;
};

export default function AuthRedirect() {
  return (
    <div className="w-full flex justify-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen"></div>
  );
}
