import { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "../supabase.server";
import {
  Outlet,
} from "@remix-run/react";
import { isMobile } from "../utils/params";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const userAgent = request.headers.get("user-agent");
  const user = await supabaseClient.auth.getUser();

  return {
    mobile: isMobile(userAgent!),
    user,
  };
};

export default function Blog() {

  return (
    <div>
      <Outlet />
    </div>
  );
}
