import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Link,
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

  return {
    mobile: isMobile(userAgent!),
  };
};

export default function RestrictedOffer() {
  const [searchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const {
    mobile,
  }: {
    mobile: boolean;
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
      />
      <div className="bg-gray-100">
        <div className="w-full xl:w-[1260px] mx-auto px-2 md:px-8 py-8 lg:py-14">
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
      </div>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
