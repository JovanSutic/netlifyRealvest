import { Link, MetaFunction, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { createSupabaseServerClient } from "../supabase.server";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getParamValue } from "../utils/params";
import { FinalError } from "../types/component.types";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translator = new Translator("auth");
  return [
    { title: translator.getTranslation(lang, "successMetaTitle") },
    {
      name: "description",
      content: translator.getTranslation(lang, "successMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const lang = new URL(request.url).searchParams.get("lang") || "sr";

  let isError = false;
  let finalError: FinalError | null = null;
  try {
    const {data: userData} = await supabaseClient.auth.getUser();

    if (userData.user && userData.user?.role === "authenticated") {
      return redirect(`/offer-restricted/?lang=${lang}`);
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

export default function RegisterSuccess() {
  const [searchParams] = useSearchParams();

  const translator = new Translator("auth");
  const lang = searchParams.get("lang") || "sr";
  const referer = searchParams.get("referer") || "brake";
  return (
    <div className="w-full flex justify-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      {referer === "registration" && (
        <div className="lg:w-1/3 md:w-1/2 sm:w-3/4 w-full">
          <div className="w-full">
            <div className="w-[140px] mx-auto">
              <Link to={`/?lang=${lang}`}>
                <img
                  src="/logo2.png"
                  alt="Realvest logo"
                  className="max-w-full"
                />
              </Link>
            </div>
          </div>
          <div className=" bg-white rounded-2xl p-6 mt-4 relative z-10 shadow-lg">
            <div className="mb-10">
              <h3 className="text-3xl text-center font-extrabold text-slate-800 mb-3">
                {translator.getTranslation(lang!, "success")}
              </h3>
              <h3 className="text-sm text-center text-slate-400">
                {translator.getTranslation(lang!, "successText")}
              </h3>
            </div>

            <div className="mt-4">
              <p className="text-sm text-center mt-6">
                {translator.getTranslation(lang!, "alreadyConfirm")}
                <Link
                  to={`/auth/?lang=${lang}`}
                  className="text-blue-500 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  {translator.getTranslation(lang!, "signTitle")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
      {referer === "recovery" && (
        <div className="lg:w-1/3 md:w-1/2 sm:w-3/4 w-full">
          <div className="w-full">
            <div className="w-[140px] mx-auto">
              <Link to={`/?lang=${lang}`}>
                <img
                  src="/logo2.png"
                  alt="Realvest logo"
                  className="max-w-full"
                />
              </Link>
            </div>
          </div>
          <div className=" bg-white rounded-2xl p-6 mt-4 relative z-10 shadow-lg">
            <div className="mb-10">
              <h3 className="text-3xl text-center font-extrabold text-slate-800 mb-3">
                {translator.getTranslation(lang!, "passForgot")}
              </h3>
              <h3 className="text-sm text-center text-slate-400">
                {translator.getTranslation(lang!, "recoverySend")}
              </h3>
            </div>

            <div className="mt-4">
              <p className="text-sm text-center mt-6">
                {translator.getTranslation(lang!, "backTo")}
                <Link
                  to={`/auth/?lang=${lang}`}
                  className="text-blue-500 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  {translator.getTranslation(lang!, "signTitle")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
