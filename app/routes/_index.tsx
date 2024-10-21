import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import Accordion from "../components/accordion";
import { AccordionData, FinalError } from "../types/component.types";
import { useState } from "react";
import { createSupabaseServerClient } from "../supabase.server";
import { makeNumberCurrency } from "../utils/numbers";
import MarketCard from "../components/card/MarketCard";
import { LangType } from "../types/dashboard.types";
import { differenceInDays } from "date-fns";
import { MarketIndexItem, PhotoItem } from "../types/market.types";
import {
  calculateIRR,
  getPropertyPurchaseExpenses,
  getNumberWithDecimals,
} from "../utils/market";
import { calculateFuturePrice } from "../utils/dashboard";
import { Blog } from "../types/blog.types";
import BlogCard from "../components/card/BlogCard";

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
  const lang = new URL(request.url).searchParams.get("lang") || "sr";

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);

    const { data: potentialData, error: potentialError } =
      await supabaseClient.rpc("get_homepage_potential");

    if (potentialError) {
      isError = true;
      finalError = potentialError as FinalError;
    }

    const { data: rentalData, error: rentalError } = await supabaseClient.rpc(
      "get_homepage_rental"
    );

    if (rentalError) {
      isError = true;
      finalError = rentalError as FinalError;
    }

    const apartmentIds: number[] = [];
    potentialData?.forEach((item: MarketIndexItem) =>
      apartmentIds.push(item.id)
    );
    rentalData?.forEach((item: MarketIndexItem) => apartmentIds.push(item.id));

    const { data: photoData, error: photoError } = await supabaseClient
      .from("photos")
      .select("id, link, apartment_id")
      .in("apartment_id", apartmentIds)
      .order("id");

    if (photoError) {
      isError = true;
      finalError = photoError as FinalError;
    }

    const photos: Record<string, PhotoItem> = {};

    photoData?.forEach((item) => {
      if (photos[item.apartment_id as string] === undefined) {
        photos[item.apartment_id] = item;
      }
    });

    const resultsRental: MarketIndexItem[] = [];

    (rentalData || [])?.forEach((item: MarketIndexItem) => {
      resultsRental.push({
        ...item,
        photo: photos[item.id],
      });
    });

    const resultsPotential: MarketIndexItem[] = [];

    (potentialData || [])?.forEach((item: MarketIndexItem) => {
      resultsPotential.push({
        ...item,
        photo: photos[item.id],
      });
    });

    const { data: blogData, error: blogError } = await supabaseClient
      .from("blogs")
      .select("*")
      .eq("language", lang)
      .order("id")
      .limit(4);

    if (blogError) {
      isError = true;
      finalError = blogError as FinalError;
    }

    return {
      mobile: isMobile(userAgent!),
      potential: resultsPotential,
      rental: resultsRental,
      blogs: blogData,
    };
  } catch (error) {
    console.log(error);
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return {
    potential: [],
    rental: [],
    blogs: [],
    mobile: isMobile(userAgent!),
  };
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const translator = new Translator("homepage");
  const translate = new Translator("market");

  const [activeFaq, setActiveFaq] = useState<number>(1);

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
    potential,
    rental,
    blogs,
  }: {
    mobile: boolean;
    potential: MarketIndexItem[];
    rental: MarketIndexItem[];
    blogs: Blog[];
  } = useLoaderData();

  return (
    <>
      <TPage color="bg-white" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-row justify-center">
                <div className="w-[140px] md:w-[160px]">
                  <img
                    src="logo1.png"
                    alt="Realvest logo"
                    className="max-w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col md:mt-3 md:mt-0">
                <div className="flex flex-col md:flex-row items-center">
                  <Link
                    to={`auth/?lang=${lang}`}
                    className="hidden md:block text-md px-4 py-2 bg-slate-600 font-semibold text-white rounded-xl transition-all duration-300 transform hover:bg-slate-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {translator.getTranslation(lang, "haveAccount")}
                  </Link>
                  <Link
                    to={`/?lang=${lang === "sr" ? "en" : "sr"}`}
                    className="text-sm font-regular text-blue-500 transform hover:text-blue-700 md:mt-3 md:mt-0 ml-0 md:ml-6"
                  >
                    {lang === "sr" ? "english version" : "srpska verzija"}
                  </Link>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>

      <TPage color="bg-white" mobile={mobile}>
        <TLine columns={12} gap={2}>
          <TColumn span={12}>
            <div className="w-full flex flex-row">
              <div className="w-full relative rounded-md md:overflow-hidden md:grayscale-[40%]">
                <picture className="hidden md:block">
                  <source
                    srcSet="https://belgradeepass.com/uploads/images/b_adsiz-tasarim-21-1-.webp"
                    type="image/webp"
                  />
                  <img
                    src="https://belgradeepass.com/uploads/images/b_adsiz-tasarim-21-1-.webp"
                    alt="Belgrade cityscape"
                    width="100%"
                    height="auto"
                  />
                </picture>
                <div className="relative md:absolute top-0 md:top-10 w-full flex flex-col items-center mb-4 md:mb-0">
                  <div className="w-full md:w-[80%] lg:w-[40%] text-center">
                    <h1 className="text-gray-600 md:text-white font-bold text-2xl lg:text-4xl md:drop-shadow-xl text-center px-2 md: leading-[24px] lg:leading-[48px] mb-4 md:mb-2 lg:mb-8">
                      {translator.getTranslation(lang, "heroTitle")}
                    </h1>
                    <h2 className="w-full drop-shadow-xl text-black md:text-white text-lg lg:text-xl text-center md:bg-gray-800 md:bg-opacity-60 p-1 rounded-lg mb-6 md:mb-4 lg:mb-8">
                      {translator.getTranslation(lang, "heroSubtitle")}
                    </h2>
                    <Link
                      to={`/market/?lang=${lang}&page=1`}
                      className="text-md px-4 py-2 bg-blue-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-opacity-50"
                    >
                      {translator.getTranslation(lang, "heroCta")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>

      <TPage color="bg-white" mobile={mobile}>
        <div className="mt-0 lg:mt-4">
          <h2 className="text-[24px] md:text-[32px] font-bold text-center mb-2">
            {translator.getTranslation(lang, "potentialTitle")}
          </h2>
          <div className="py-6 px-2 md:px-4 lg:px-12 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {potential.slice(0, mobile ? 2 : 5).map((item) => {
                return (
                  <MarketCard
                    key={item?.id}
                    link={`/market/${item?.id}?lang=${lang}&home=1`}
                    lang={lang as LangType}
                    price={makeNumberCurrency(item!.price)}
                    appreciation={item?.profitability_competition_trend || 0}
                    photo={item?.photo?.link || ""}
                    title={`${item?.city_part}, ${item?.size}m2`}
                    rent={(item?.profitability_rental_count || 0) > 2}
                    irr={`${getNumberWithDecimals(
                      calculateIRR(
                        item.price +
                          getPropertyPurchaseExpenses(item.price).total,
                        calculateFuturePrice(
                          item.average_price,
                          item.profitability_competition_trend,
                          5
                        ) * item.size,
                        5
                      ),
                      2
                    )}%`}
                    duration={`${translate.getTranslation(lang, "onMarket")} ${
                      differenceInDays(
                        item?.date_signed || new Date(),
                        new Date()
                      ) < 1
                        ? Math.abs(
                            differenceInDays(
                              item?.date_signed || new Date(),
                              new Date()
                            )
                          )
                        : 0
                    } ${translate.getTranslation(lang, "days")}`}
                  />
                );
              })}
            </div>
            <div className="w-full text-center mt-8">
              <Link
                to={`/market/?lang=${lang}&page=1`}
                className="text-xl text-blue-500 hover:underline"
              >
                {translator.getTranslation(lang, "marketAll")}
              </Link>
            </div>
          </div>
        </div>
      </TPage>

      <TPage mobile={mobile}>
        <div className="w-full mt-12 mb-10">
          <div className="w-full md:w-[80%] lg:w-[60%] mx-auto">
            <h3 className="font-bold text-center text-2xl md:text-4xl">
              {translator.getTranslation(lang, "saveTimeTitle")}
            </h3>
            <p className="font-regular text-center text-md md:text-[18px] mt-4 md:mt-8 text-gray-600">
              {translator.getTranslation(lang, "saveTimeText")}
            </p>
          </div>

          <div className="flex flex-row justify-center mt-12">
            <Link
              to={`auth/register/?lang=${lang}`}
              className="px-6 py-3 text-md font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
            >
              {translator.getTranslation(lang, "accountCta")}
            </Link>
          </div>
        </div>
      </TPage>

      <TPage color="bg-white" mobile={mobile}>
        <div className="mt-6 lg:mt-10">
          <h2 className="text-[24px] md:text-[32px] font-bold text-center mb-2">
            {translator.getTranslation(lang, "rentalTitle")}
          </h2>
          <div className="py-6 px-2 md:px-4 lg:px-12 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {rental.slice(0, mobile ? 2 : 5).map((item) => {
                return (
                  <MarketCard
                    key={item?.id}
                    link={`/market/${item?.id}?lang=${lang}&home=1`}
                    lang={lang as LangType}
                    price={makeNumberCurrency(item!.price)}
                    appreciation={item?.profitability_competition_trend || 0}
                    photo={item?.photo?.link || ""}
                    title={`${item?.city_part}, ${item?.size}m2`}
                    rent={(item?.profitability_rental_count || 0) > 2}
                    rentPrice={makeNumberCurrency(
                      item.profitability_average_rental * item.size
                    )}
                    duration={`${translate.getTranslation(lang, "onMarket")} ${
                      differenceInDays(
                        item?.date_signed || new Date(),
                        new Date()
                      ) < 1
                        ? Math.abs(
                            differenceInDays(
                              item?.date_signed || new Date(),
                              new Date()
                            )
                          )
                        : 0
                    } ${translate.getTranslation(lang, "days")}`}
                  />
                );
              })}
            </div>
            <div className="w-full text-center mt-8">
              <Link
                to={`/market/?lang=${lang}&page=1`}
                className="text-xl text-blue-500 hover:underline"
              >
                {translator.getTranslation(lang, "marketAll")}
              </Link>
            </div>
          </div>
        </div>
      </TPage>
      {blogs.length > 2 && (
        <TPage color="bg-white" mobile={mobile}>
          <div className="py-2 mb-3 md:mb-6">
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
      )}

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
      <TPage color="bg-gray-700" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <footer className="bg-gray-700 p-10 font-[sans-serif] tracking-wide">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="lg:flex">
                  <div className="max-w-[150px]">
                    <img src="logo3.png" alt="logo" className="w-full" />
                  </div>
                </div>

                <div className="lg:flex">
                  <ul className="flex space-x-6">
                    <li>
                      <a
                        href="https://www.linkedin.com/company/yourealvest/?viewAsMember=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Linkedin Realvest"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-gray-300 hover:fill-white w-10 h-10"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zm-2.5 8.2v5.3h-2.79v-4.93a1.4 1.4 0 0 0-1.4-1.4c-.77 0-1.39.63-1.39 1.4v4.93h-2.79v-8.37h2.79v1.11c.48-.78 1.47-1.3 2.32-1.3 1.8 0 3.26 1.46 3.26 3.26zM6.88 8.56a1.686 1.686 0 0 0 0-3.37 1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 1.57v8.37H5.5v-8.37h2.77z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    {translator.getTranslation(lang, "contact")}
                  </h4>
                  <ul className="text-gray-300 hover:text-white text-sm">
                    <li>office@yourealvest.com</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    {translator.getTranslation(lang, "footerInfo")}
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to={`/market/?lang=${lang}&page=1`}
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        {translator.getTranslation(lang, "market")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/blog?lang=${lang}`}
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        {translator.getTranslation(lang, "blog")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/terms?lang=${lang}`}
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        {translator.getTranslation(lang, "footerTerms")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/privacy?lang=${lang}`}
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        {translator.getTranslation(lang, "footerPrivacy")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-300 text-sm mt-10">
                © 2024 Realvest All Rights Reserved.
              </p>
            </footer>
          </TColumn>
        </TLine>
      </TPage>
    </>
  );
}
