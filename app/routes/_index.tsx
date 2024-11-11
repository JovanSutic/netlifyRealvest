import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import Accordion from "../components/accordion";
import { AccordionData } from "../types/component.types";
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

export default function Index() {
  const [searchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const translator = new Translator("homepage");

  const [activeFaq, setActiveFaq] = useState<number>(7);

  const accordionData: AccordionData[] = [
    {
      id: 7,
      title: translator.getTranslation(lang, "faq7Title"),
      text: translator.getTranslation(lang, "faq7Text"),
    },
    {
      id: 1,
      title: translator.getTranslation(lang, "faq1Title"),
      text: translator.getTranslation(lang, "faq1Text"),
    },
    {
      id: 2,
      title: translator.getTranslation(lang, "faq2Title"),
      text: translator.getTranslation(lang, "faq2Text"),
    },
    {
      id: 3,
      title: translator.getTranslation(lang, "faq3Title"),
      text: translator.getTranslation(lang, "faq3Text"),
    },
    {
      id: 4,
      title: translator.getTranslation(lang, "faq4Title"),
      text: translator.getTranslation(lang, "faq4Text"),
    },
    {
      id: 5,
      title: translator.getTranslation(lang, "faq5Title"),
      text: translator.getTranslation(lang, "faq5Text"),
    },
    {
      id: 6,
      title: translator.getTranslation(lang, "faq6Title"),
      text: translator.getTranslation(lang, "faq6Text"),
    },
  ];

  const {
    mobile,
  }: {
    mobile: boolean;
  } = useLoaderData();

  const navigation = useNavigation();
  const location = useLocation();

  location.search;

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
      <div className="bg-blue-100">
        <div className="w-full xl:w-[1260px] mx-auto px-2 md:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 lg:col-span-2">
              <div>
                <h1 className="text-[46px] lg:text-[60px] leading-[56px] lg:leading-[68px] font-semibold mb-6">
                  {translator.getTranslation(lang, "heroTitle")}
                </h1>
                <p className="text-[16px] lg:text-[18px] leading-[24px] lg:leading-[28px] w-full font-light mb-10">
                  {translator.getTranslation(lang, "heroSubtitle")}
                  <span className="font-semibold ml-2">
                    {translator.getTranslation(lang, "heroSubtitleBold")}
                  </span>
                </p>
                <div className="w-[70%]">
                  <Link
                    to={`auth/register?lang=${lang}`}
                    className="text-[16px] text-center font-semibold px-6 py-2 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {translator.getTranslation(lang, "accountBtn")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-5 lg:col-span-3 ">
              <div className="w-full flex justify-center lg:justify-end">
                <div>
                  <img
                    src="/homeImg.jpg"
                    alt="home-img"
                    className="max-w-[100%] text-center rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {blogs.length > 2 && (
        <TPage color="bg-white" mobile={mobile}>
          <div className="py-6 px-2 md:px-4 lg:px-12 rounded-lg">
            <div>
              <h3 className="text-[24px] md:text-[32px] font-bold text-center mb-10">
                {translator.getTranslation(lang, "homeBlogTitle")}
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {blogs.map((item) => (
                <BlogCard
                  key={item.slug}
                  lang={lang}
                  isHome
                  blog={item as unknown as Blog}
                />
              ))}
            </div>
            <div className="flex flex-row items-center mt-6 md:mt-8">
              <Link
                to={`/blog/?lang=${lang}&page=1`}
                className="w-full font-regular text-center text-blue-500 hover:underline text-lg lg:text-xl"
              >
                {translator.getTranslation(lang, "homeBlogAll")}
              </Link>
            </div>
          </div>
        </TPage>
      )} */}

      <TPage mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="w-full py-10 mb-0 md:mb-4">
              <h3 className="text-slate-800 font-bold text-2xl md:text-3xl mb-6 md:mb-8">
                {translator.getTranslation(lang, "faq")}
              </h3>
              <Accordion
                active={activeFaq}
                changeActive={setActiveFaq}
                data={accordionData}
              />
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
