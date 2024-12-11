import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import { useState, useEffect } from "react";
import { LangType } from "../types/dashboard.types";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/loader/PageLoader";
import NavigationColumn from "../components/navigation/NavigationColumn";
// import ToggleButton from "../components/toggleButtons/ToggleButton";
// import PropertyCard from "../components/card/PropertyCard";
import { createSupabaseServerClient } from "../supabase.server";
import { User } from "@supabase/supabase-js";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translator = new Translator("homepage");
  return [
    { title: translator.getTranslation(lang, "homeMetaTitle") },
    {
      name: "description",
      content: translator.getTranslation(lang, "homeMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const { supabaseClient } = createSupabaseServerClient(request);

  try {
    const { data: userData } = await supabaseClient.auth.getUser();

    return {
      mobile: isMobile(userAgent!),
      user: userData.user || null,
    };
  } catch (error) {
    console.log(error);
  }

  return {
    mobile: isMobile(userAgent!),
    user: null,
  };
};

export default function RestrictedOffer() {
  const [searchParams] = useSearchParams();
  // const [infoType, setInfoType] = useState<"properties" | "transactions">(
  //   "properties"
  // );
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const {
    mobile,
    user,
  }: {
    mobile: boolean;
    user: User;
  } = useLoaderData();

  const translator = new Translator("navigation");

  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname || location.search) {
      setIsNavOpen(false);
    }
  }, [location.pathname, location.search]);
  return (
    <>
      <PageLoader open={navigation.state === "loading"} />
      <NavigationColumn
        isOpen={isNavOpen}
        toggleOpen={() => setIsNavOpen(!isNavOpen)}
        lang={lang}
        user={user}
        url={location.pathname}
      />
      <div className="bg-white border-t-[1px] border-gray-300">
        <div className="w-full xl:w-[1080px] mx-auto px-4">
          <div className="w-full">
            <h1 className="w-full text-3xl font-bold mt-8 text-center">{translator.getTranslation(lang, 'portfolio')}</h1>

            <div className="mb-14 mt-8">
              <p className="w-full text-[16px] font-gray-700 text-center">{translator.getTranslation(lang, 'portfolioEmpty')}</p>
            </div>


            {/* <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="mt-8">
                <p className="font-semibold text-[17px]">
                  {translator.getTranslation(lang, "portYour")}
                </p>
                <p className="font-bold text-[40px] leading-[52px] text-blue-500">
                  2,500.00 €
                </p>
                <p className="font-light text-[16px]">
                  {translator.getTranslation(lang, "portTract")}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-2 mt-6">
                <div className="flex flex-col lg:justify-center">
                  <p className="text-[16px] lg:text-[14px]">
                    {translator.getTranslation(lang, "portAccumulated")}
                  </p>
                  <p className="font-bold text-teal-500 text-[26px] lg:text-[20px] leading-[28px] lg:leading-[22px]">
                    52.50€
                  </p>
                </div>
                <div className="flex flex-col lg:hidden "></div>
                <div className="flex flex-col lg:justify-center">
                  <p className="text-[16px] lg:text-[14px]">
                    {translator.getTranslation(lang, "portNext")}
                  </p>
                  <p className="flex items-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-7 lg:size-6 font-bold  text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="ml-2 font-semibold text-[18px] lg:text-[14px] leading-[28px] lg:leading-[16px]">
                      9.25 €
                    </span>
                  </p>
                </div>
                <div className="flex flex-col lg:justify-center">
                  <p className="text-[16px] lg:text-[14px]">
                    {translator.getTranslation(lang, "portNextDate")}
                  </p>
                  <p className="flex items-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-7 lg:size-6 font-bold text-red-400"
                    >
                      <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                      <path
                        fillRule="evenodd"
                        d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 font-semibold text-[18px] lg:text-[14px] leading-[28px] lg:leading-[16px]">
                      Jan 24 2025
                    </span>
                  </p>
                </div>
              </div>
            </div> */}

            {/* <div className="mt-8 pb-12">
              <div className="w-full lg:w-[500px] mx-auto">
                <ToggleButton
                  fullWidth
                  value={infoType}
                  onChange={(value: string) =>
                    setInfoType(value as "properties" | "transactions")
                  }
                  options={[
                    {
                      text: translator.getTranslation(lang, "portProp"),
                      value: "properties",
                    },
                    {
                      text: translator.getTranslation(lang, "portTrans"),
                      value: "transactions",
                    },
                  ]}
                />
              </div>

              {infoType === "properties" ? (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
                  <PropertyCard
                    name={"55 m2, Beograd na vodi, Beograd"}
                    photo="https://img.nekretnine.rs/foto/NjU4eDQ5NC9jZW50ZXIvbWlkZGxlL2ZpbHRlcnM6d2F0ZXJtYXJrKGh0dHBzOi8vd3d3Lm5la3JldG5pbmUucnMvYnVpbGQvaW1hZ2VzL3dhdGVybWFyay0yNTYucG5nLGNlbnRlcixjZW50ZXIsNTApOmZvcm1hdCh3ZWJwKS9uZWs=/TGusuEMlV_fss?st=I2Bix4AV7M6ROd6JrgW3IfoMdVOtxzeE6RL4CQ004BE&ts=1731370739&e=0"
                    bondsNumber={3}
                    investment={1500}
                    interest={32.5}
                    maturity={20}
                    lang={lang}
                    link={`/auth/?lang=${lang}`}
                  />
                  <PropertyCard
                    name={"44 m2, Zeleni Venac, Beograd"}
                    photo="https://img.nekretnine.rs/foto/Zml0LWluLzEwNjR4Nzk4L2NlbnRlci9taWRkbGUvZmlsdGVyczp3YXRlcm1hcmsoaHR0cHM6Ly93d3cubmVrcmV0bmluZS5ycy9idWlsZC9pbWFnZXMvd2F0ZXJtYXJrLTM0MHgzLnBuZyxjZW50ZXIsY2VudGVyLDUwKTpxdWFsaXR5KDgwKS9uZWs=/pwFJK_ZUW_fss?st=TvBk4pdk6xUBH9cFBwtSoGA3YsJlEvux1sHLELgA3Ks&ts=1678959697&e=0"
                    bondsNumber={2}
                    investment={1000}
                    interest={20}
                    maturity={20}
                    lang={lang}
                    link={`/auth/?lang=${lang}`}
                  />
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-8"></div>
              )}
            </div> */}
          </div>
        </div>
      </div>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
