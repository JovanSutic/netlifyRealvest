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
import { jwtDecode } from "jwt-decode";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const currentUrl = new URL(request.url);
  const userAgent = request.headers.get("user-agent");
  const lang = currentUrl.searchParams.get("lang") || "sr";

  try {
    const {data: userData} = await supabaseClient.auth.getUser();
    if (userData.user && userData.user?.role !== "authenticated") {
      return redirect(`/auth?lang=${lang}`);
    } else {
      const session = await supabaseClient.auth.getSession();

      const decoded = jwtDecode<{ user_role: string }>(
        session?.data?.session?.access_token || ""
      );

      if (decoded.user_role !== "admin") {
        return redirect(`/`);
      }

      if (
        userData?.user?.role === "authenticated" &&
        currentUrl.pathname === "/dashboard"
      ) {
        return redirect(`/dashboard/search?lang=${lang}`);
      }
    }

    return {
      mobile: isMobile(userAgent!),
      user: userData,
    };
  } catch (error) {
    console.log(error);
  }

  return {
    mobile: isMobile(userAgent!),
    user: null,
  };
};

export default function Dashboard() {
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

  if (user) {
    return (
      <div>
        {mobile ? (
          <MobileNavigation
            isOpen={isOpen}
            toggleOpen={() => setIsOpen(!isOpen)}
            lang={lang}
            url={`${location.pathname}${location.search}`}
            name={user.user?.user_metadata.display_name}
            signOutLink={`/auth/sign_out?lang=${lang}`}
          />
        ) : (
          <SideNavigation
            url={`${location.pathname}${location.search}`}
            name={user.user?.user_metadata.display_name}
            signOutLink={`/auth/sign_out?lang=${lang}`}
            lang={lang}
          />
        )}

        <Outlet />
      </div>
    );
  }
}
