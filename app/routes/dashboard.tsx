import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import SideNavigation from "../components/navigation/SideNavigation";
import { LangType } from "../types/dashboard.types";
import { isMobile } from "../utils/params";
import MobileNavigation from "../components/navigation/MobileNavigation";
import { useEffect, useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const currentUrl = new URL(request.url);
  const userAgent = request.headers.get("user-agent");
  const lang = currentUrl.searchParams.get("lang") || "sr";
  const user = await supabaseClient.auth.getUser();
  if (user?.data?.user?.role !== "authenticated") {
    throw redirect(`/auth?lang=${lang}`);
  }

  if (
    user?.data?.user?.role === "authenticated" &&
    currentUrl.pathname === "/dashboard"
  ) {
    throw redirect(`/dashboard/search?lang=${lang}`);
  }

  return {
    mobile: isMobile(userAgent!),
    user,
  };
};

export default function Report() {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const { user, mobile } = useLoaderData<typeof loader>();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div>
      {mobile ? (
        <MobileNavigation
          isOpen={isOpen}
          toggleOpen={() => setIsOpen(!isOpen)}
          lang={lang}
          url={location.pathname}
          name={user.data.user?.user_metadata.display_name}
          signOutLink={`/auth/sign_out?lang=${lang}`}
        />
      ) : (
        <SideNavigation
          url={location.pathname}
          name={user.data.user?.user_metadata.display_name}
          signOutLink={`/auth/sign_out?lang=${lang}`}
          lang={lang}
        />
      )}

      <Outlet />
    </div>
  );
}
