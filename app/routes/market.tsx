import { LoaderFunctionArgs } from "@remix-run/node";
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
  const userAgent = request.headers.get("user-agent");
  let userName = '';
  try {
    const user = await supabaseClient.auth.getUser();

    if(user) {
      userName = user.data.user?.user_metadata.display_name;
    }
  } catch (error) {
    console.log(error);
  }

  return {
    mobile: isMobile(userAgent!),
    userName,
  };
};

export default function Market() {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const { userName, mobile } = useLoaderData<typeof loader>();
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
          url={`${location.pathname}${location.search}`}
          name={userName}
          signOutLink={`/auth/sign_out?lang=${lang}`}
        />
      ) : (
        <SideNavigation
          url={`${location.pathname}${location.search}`}
          name={userName}
          signOutLink={`/auth/sign_out?lang=${lang}`}
          lang={lang}
        />
      )}

      <Outlet />
    </div>
  );
}
