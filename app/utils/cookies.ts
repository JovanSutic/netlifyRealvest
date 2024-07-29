import { createCookie } from "@remix-run/node";

type CookieType = "refresh" | "auth";

const getCookieName = (type: CookieType): string => {
  if (type !== "refresh" && type !== "auth")
    throw Error("Error getCookieName type is not right!");
  const supabaseUrl = new URL(process.env.SUPABASE_URL_LOCAL!);
  const local = !supabaseUrl.hostname.includes("supabase");
  const reference = local ? "127" : supabaseUrl.hostname.split(".")[0];

  return type === "refresh"
    ? `sb-${reference}-auth-token-refresh`
    : `sb-${reference}-auth-token`;
};

export const authCookie = createCookie(getCookieName("auth"), {
  path: "/",
  sameSite: "lax",
  httpOnly: false,
  maxAge: 10000,
});

export const refreshCookie = createCookie(getCookieName("refresh"), {
  path: "/",
  sameSite: "lax",
  httpOnly: false,
  maxAge: 10000,
});
