import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import { useState, useEffect } from "react";
import { LangType } from "../types/dashboard.types";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/loader/PageLoader";
import NavigationColumn from "../components/navigation/NavigationColumn";
import { User } from "@supabase/supabase-js";
// import OfferCard from "../components/card/OfferCard";

// const SuccessScreen = () => {
//   return (
//     <div className="w-full h-[1000px] flex flex-col items-center">
//     <div className="w-full flex flex-col items-center mt-10">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={1.5}
//         stroke="currentColor"
//         className="size-20 font-bold text-teal-500"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//         />
//       </svg>
//       <h2 className="mt-4 text-center text-gray-800 font-semibold text-[32px]">
//         Čestitamo
//       </h2>
//       <p className="mt-12 text-center font-light text-[17px] leading-[26px]">
//         Investirali ste <span className="font-semibold">1,000 €</span>{" "}
//         u 2 Realvest obveznice za nekretninu{" "}
//         <span className="font-semibold">
//           55 m2, Beograd na vodi, Beograd
//         </span>
//         .
//       </p>

//       <p className="mt-4 text-center font-light text-[17px] leading-[26px]">
//         Dobra odluka, sada vaša investicija radi za vas.
//       </p>
//       <div className="w-full flex flex-col items-center mt-8">
//         <Link to="/" className="underline text-blue-500">
//           Pogledajte svoj portfolio
//         </Link>
//       </div>
//     </div>
//   </div>
//   )
// }

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
    if (userData.user) {
      return {
        mobile: isMobile(userAgent!),
        user: userData.user
      }
    }
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
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const {
    mobile,
    user,
  }: {
    mobile: boolean;
    user: User | null;
  } = useLoaderData();

  const translator = new Translator("knowledge");

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
        <div className="w-full xl:w-[1260px] mx-auto px-2 md:px-8 py-8 lg:py-14">
          <div>
            <h1 className="w-full text-center text-3xl font-semibold">
              {translator.getTranslation(lang, "restrictedConst")}
            </h1>
            <div className="flex flex-row justify-center mt-12">
              <Link
                to={`/?lang=${lang}`}
                className="text-[16px] text-center font-semibold px-6 py-2 bg-gray-500 text-white rounded-xl transition-all duration-300 transform hover:bg-gray-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
              >
                {translator.getTranslation(lang, "backBtn")}
              </Link>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 mt-10">
            <OfferCard
              name={"55 m2, Beograd na vodi, Beograd"}
              photo="https://img.nekretnine.rs/foto/NjU4eDQ5NC9jZW50ZXIvbWlkZGxlL2ZpbHRlcnM6d2F0ZXJtYXJrKGh0dHBzOi8vd3d3Lm5la3JldG5pbmUucnMvYnVpbGQvaW1hZ2VzL3dhdGVybWFyay0yNTYucG5nLGNlbnRlcixjZW50ZXIsNTApOmZvcm1hdCh3ZWJwKS9uZWs=/TGusuEMlV_fss?st=I2Bix4AV7M6ROd6JrgW3IfoMdVOtxzeE6RL4CQ004BE&ts=1731370739&e=0"
              isPremium
              interest={4.25}
              maturity={10}
              lang={lang}
              link={`/auth/?lang=${lang}`}
              bondPrice={500}
            />

            <OfferCard
              name={"44 m2 Zeleni Venac, Beograd"}
              photo="https://img.nekretnine.rs/foto/Zml0LWluLzEwNjR4Nzk4L2NlbnRlci9taWRkbGUvZmlsdGVyczp3YXRlcm1hcmsoaHR0cHM6Ly93d3cubmVrcmV0bmluZS5ycy9idWlsZC9pbWFnZXMvd2F0ZXJtYXJrLTM0MHgzLnBuZyxjZW50ZXIsY2VudGVyLDUwKTpxdWFsaXR5KDgwKS9uZWs=/pwFJK_ZUW_fss?st=TvBk4pdk6xUBH9cFBwtSoGA3YsJlEvux1sHLELgA3Ks&ts=1678959697&e=0"
              isPremium
              interest={3.8}
              maturity={8}
              lang={lang}
              link={`/auth/?lang=${lang}`}
              bondPrice={500}
            />
          </div> */}
        </div>
      </div>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
