import { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import { Outlet } from "@remix-run/react";
import { isMobile } from "../utils/params";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const userAgent = request.headers.get("user-agent");
  try {
    const { data: userData } = await supabaseClient.auth.getUser();
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

export default function Blog() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
