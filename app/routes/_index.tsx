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
        <div className="w-full xl:w-[1260px] mx-auto px-2 md:px-8 py-8 lg:py-14">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 lg:col-span-2">
              <div>
                <h1 className="text-[46px] lg:text-[60px] leading-[56px] lg:leading-[68px] font-semibold mb-6">
                  {translator.getTranslation(lang, "heroTitle")}
                </h1>
                <p className="text-[16px] lg:text-[18px] leading-[24px] lg:leading-[28px] w-full font-light mb-2">
                  {translator.getTranslation(lang, "heroSubtitle")}
                </p>
                <p className="text-[16px] lg:text-[18px] leading-[24px] lg:leading-[28px] w-full font-light mb-10 font-semibold">
                  {translator.getTranslation(lang, "heroSubtitleBold")}
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

      <div className="bg-white">
        <div className="w-full xl:w-[1080px] mx-auto px-10 md:px-8 py-8 lg:py-14">
          <div className="w-full mb-8">
            <h2 className="font-semibold text-[30px] text-center mb-4">
              {translator.getTranslation(lang, "latest")}
            </h2>
            <p className="text-[16px] lg:text-[18px] leading-[24px] lg:leading-[28px] w-full font-light mb-2 text-center">
              {translator.getTranslation(lang, "latestSub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 mb-8">
            <div className="mb-8 lg:mb-0">
              <img
                src="/homeImg.jpg"
                alt="home-img"
                className="max-w-[100%] text-center rounded-xl mb-4"
              />
              <p className="font-semibold text-[19px] lg:text-[17px] mb-1">
                38 m2 Vračar, Beograd
              </p>
              <p className="font-regular text-[18px] lg:text-[16px]">
                {`${translator.getTranslation(lang, "interest")} 3.7%`}
              </p>
            </div>
            <div className="mb-8 lg:mb-0">
              <img
                src="/homeImg.jpg"
                alt="home-img"
                className="max-w-[100%] text-center rounded-xl mb-4"
              />
              <p className="font-semibold text-[17px] mb-1">
                44 m2 Zeleni Venac, Beograd
              </p>
              <p className="font-regular text-[16px]">
                {`${translator.getTranslation(lang, "interest")} 4.2%`}
              </p>
            </div>
            <div className="mb-8 lg:mb-0">
              <img
                src="/homeImg.jpg"
                alt="home-img"
                className="max-w-[100%] text-center rounded-xl mb-4"
              />
              <p className="font-semibold text-[17px] mb-1">
                54 m2 Mirijevo, Beograd
              </p>
              <p className="font-regular text-[16px]">
                {`${translator.getTranslation(lang, "interest")} 3.8%`}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <Link
              to={`auth/register?lang=${lang}`}
              className="text-[16px] text-center font-semibold px-6 py-2 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
            >
              {translator.getTranslation(lang, "moreBtn")}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50">
        <div className="w-full xl:w-[1080px] mx-auto px-10 md:px-8 py-8 lg:py-14">
          <div className="w-full mb-16">
            <h2 className="font-semibold text-[30px] text-center mb-4">
              {translator.getTranslation(lang, "why")}
            </h2>
            <p className="text-[16px] lg:text-[18px] leading-[24px] lg:leading-[28px] w-full font-light mb-2 text-center">
              {translator.getTranslation(lang, "whySub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/apartment.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-semibold text-center text-[17px] mb-2">
                {translator.getTranslation(lang, "whyOption1")}
              </p>
              <p className="font-regular text-[14px] text-center">
                {translator.getTranslation(lang, "whyOption1Sub")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/income.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-semibold text-center text-[17px] mb-2">
                {translator.getTranslation(lang, "whyOption2")}
              </p>
              <p className="font-regular text-[14px] text-center">
                {translator.getTranslation(lang, "whyOption2Sub")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/statistics.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-semibold text-center text-[17px] mb-2">
                {translator.getTranslation(lang, "whyOption3")}
              </p>
              <p className="font-regular text-[14px] text-center">
                {translator.getTranslation(lang, "whyOption3Sub")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/pie-chart.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-semibold text-[17px] text-center mb-2">
                {translator.getTranslation(lang, "whyOption4")}
              </p>
              <p className="font-regular text-[14px] text-center">
                {translator.getTranslation(lang, "whyOption4Sub")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="w-full xl:w-[1080px] mx-auto px-10 md:px-8 py-8 lg:py-14">
          <div className="w-full mb-16">
            <h2 className="font-semibold text-[30px] text-center mb-4">
              {translator.getTranslation(lang, "how")}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/pie-chart.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-bold text-[20px] mb-2">
                {translator.getTranslation(lang, "howOption1")}
              </p>
              <p className="font-light text-[16px] text-center">
                {translator.getTranslation(lang, "howOption1Sub")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/pie-chart.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-bold text-[20px] mb-2">
                {translator.getTranslation(lang, "howOption2")}
              </p>
              <p className="font-light text-[16px] text-center">
                {translator.getTranslation(lang, "howOption2Sub")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[80px]">
                <img
                  src="/pie-chart.png"
                  alt="building-icon"
                  className="max-w-[100%] text-center rounded-xl mb-3"
                />
              </div>
              <p className="font-bold text-[20px] mb-2">
                {translator.getTranslation(lang, "howOption3")}
              </p>
              <p className="font-light text-[16px] text-center">
                {translator.getTranslation(lang, "howOption3Sub")}
              </p>
            </div>
          </div>

          <div className="flex flex-row justify-center">
            <Link
              to={`auth/register?lang=${lang}`}
              className="text-[16px] text-center font-semibold px-6 py-2 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
            >
              {translator.getTranslation(lang, "accountBtn")}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="w-full xl:w-[1080px] mx-auto px-10 md:px-8 py-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <div>
              <p className="text-[52px] font-light text-center mb-2">250K €</p>
              <p className="text-[18px] font-semibold text-center">
                Obješnjenje nekog podatka
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="w-full xl:w-[1080px] mx-auto px-2 md:px-8 py-8 lg:py-14">
          <div className="w-full mb-16">
            <h2 className="font-semibold text-[30px] text-center mb-4">
              {translator.getTranslation(lang, "faq")}
            </h2>
          </div>
          <Accordion
            active={activeFaq}
            changeActive={setActiveFaq}
            data={accordionData}
          />
        </div>
      </div>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
