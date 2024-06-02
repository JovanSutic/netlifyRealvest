import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { Outlet, useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import SideNavigation from "../components/navigation/SideNavigation";
import { LangType } from "../types/dashboard.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const currentUrl = new URL(request.url);
  const lang = currentUrl.searchParams.get("lang") || "sr";
  const user = await supabaseClient.auth.getUser();
  if (user?.data?.user?.role !== "authenticated") {
    throw redirect(`/auth?lang=${lang}`);
  }
  
  if (user?.data?.user?.role === "authenticated" && currentUrl.pathname === "/dashboard") {
    throw redirect(`/dashboard/search?lang=${lang}`);
  }

  return user;
};

export default function Report() {
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const {data} = useLoaderData<typeof loader>();
  const location = useLocation();
  return (
    <div>
      <SideNavigation url={location.pathname} name={data.user?.user_metadata.display_name} signOutLink={`/auth/sign_out?lang=${lang}`} lang={lang} />
      <Outlet />
    </div>
  );
}
