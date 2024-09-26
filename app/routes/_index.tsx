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

    return {
      mobile: isMobile(userAgent!),
      potential: resultsPotential,
      rental: resultsRental,
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
    mobile: isMobile(userAgent!),
  };
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "sr";

  const translator = new Translator("homepage");
  const translate = new Translator("market");

  const [activeFaq, setActiveFaq] = useState<number>(1);

  const accordionData: AccordionData[] = [
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
  }: {
    mobile: boolean;
    potential: MarketIndexItem[];
    rental: MarketIndexItem[];
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
              <div className="flex flex-col mt-3 md:mt-0">
                <div className="flex flex-col md:flex-row items-center">
                  <Link
                    to={`auth/?lang=${lang}`}
                    className="text-md px-4 py-2 bg-slate-600 font-semibold text-white rounded-xl transition-all duration-300 transform hover:bg-slate-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {translator.getTranslation(lang, "haveAccount")}
                  </Link>
                  <Link
                    to={`/?lang=${lang === "sr" ? "en" : "sr"}`}
                    className="text-sm font-regular text-blue-500 transform hover:text-blue-700 mt-3 md:mt-0 ml-0 md:ml-6"
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
            <div className="w-full">
              <div className="bg-[url('/bgg_panorama.jpg')] bg-opacity-20 bg-cover bg-center h-[240px] lg:h-[460px] rounded-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  <div></div>
                  {!mobile && (
                    <div className="flex flex-row items-center justify-center px-2 lg:px-10">
                      <div className="flex bg-gray-50 px-8 w-full rounded-lg w-[460px]">
                        <div className="flex flex-row items-center h-full">
                          <div className="flex flex-col items-center pt-8 pb-2 lg:pb-10">
                            <h1 className="text-[32px] font-bold text-center leading-[40px] mb-6">
                              {translator.getTranslation(lang, "heroTitle")}
                            </h1>
                            <h3 className="w-full text-[18px] text-center text-gray-700 mb-6">
                              {translator.getTranslation(lang, "heroSubtitle")}
                            </h3>
                            <Link
                              to={`auth/register/?lang=${lang}`}
                              className="px-6 py-3 text-md font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                            >
                              {translator.getTranslation(lang, "heroCta")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {mobile && (
                <div className="flex flex-row items-center mt-0 md:mt-4">
                  <div className="flex bg-white bg-opacity-90 w-full rounded-xl">
                    <div className="flex flex-row items-center h-full">
                      <div className="flex flex-col items-center pt-4 pb-2">
                        <h1 className="text-xl md:text-[32px] font-extrabold text-center mb-4 md:mb-6">
                          {translator.getTranslation(lang, "heroTitle")}
                        </h1>
                        <h3 className="text-md text-center text-gray-600 mb-4 md:mb-6">
                          {translator.getTranslation(lang, "heroSubtitle")}
                        </h3>
                        <Link
                          to={`auth/register/?lang=${lang}`}
                          className="px-6 py-3 text-md font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                        >
                          {translator.getTranslation(lang, "heroCta")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TColumn>
        </TLine>

        <div className="mt-6 lg:mt-10 mb-6">
          <h2 className="text-[24px] md:text-[32px] font-bold text-center mb-2">
            {translator.getTranslation(lang, "potentialTitle")}
          </h2>
          <div className="py-6 px-2 md:px-4 lg:px-12 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {potential.map((item) => {
                return (
                  <MarketCard
                    key={item?.id}
                    link={`/market/${item?.id}?lang=${lang}`}
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
              {translator.getTranslation(lang, "heroCta")}
            </Link>
          </div>
        </div>
      </TPage>

      <TPage color="bg-white" mobile={mobile}>
        <div className="mt-6 lg:mt-10 mb-6">
          <h2 className="text-[24px] md:text-[32px] font-bold text-center mb-2">
            {translator.getTranslation(lang, "rentalTitle")}
          </h2>
          <div className="py-6 px-2 md:px-4 lg:px-12 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {rental.map((item) => {
                return (
                  <MarketCard
                    key={item?.id}
                    link={`/market/${item?.id}?lang=${lang}`}
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
          </div>
        </div>
      </TPage>
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
                <div className="lg:flex lg:items-center">
                  <img src="logo3.png" alt="logo" className="w-52" />
                </div>

                <div className="lg:flex lg:items-center">
                  <ul className="flex space-x-6">
                    <li>
                      <a
                        href="https://www.linkedin.com/company/yourealvest/?viewAsMember=true"
                        target="_blank"
                        rel="noopener noreferrer"
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
                  <ul className="text-gray-300">
                    <li>office@yourealvest.com</li>
                  </ul>
                </div>

                {/* <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    Information
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        Terms &amp; Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div> */}
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
