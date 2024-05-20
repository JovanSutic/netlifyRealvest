import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { Link, useSearchParams } from "@remix-run/react";
import { LangType } from "../types/dashboard.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const user = await supabaseClient.auth.getUser();
  if (user?.data?.user?.role !== "authenticated") {
    throw redirect(`/auth?lang=${lang}`);
  }

  return null;
};

export default function Report() {
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  return (
    <div className="w-full flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4">
      <div>
        <Link to={`/auth/signout?lang=${lang}`}>
          <button
            type="button"
            className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none"
          >
            Sign out
          </button>
        </Link>
      </div>
      <div>
        <h2 className="center">Report Find Page</h2>
      </div>
    </div>
  );
}
