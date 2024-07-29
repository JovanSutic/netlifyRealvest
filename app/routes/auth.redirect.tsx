import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { authCookie, refreshCookie } from "../utils/cookies";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const code = new URL(request.url).searchParams.get("code");
  try {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    const { data, error: sessionError } =
      await supabaseClient.auth.exchangeCodeForSession(code!);
    if (sessionError) {
      console.log(sessionError);
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
      return redirect(`/dashboard/search?lang=${lang}`);
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default function AuthRedirect() {
  return (
    <div className="w-full flex justify-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen"></div>
  );
}
