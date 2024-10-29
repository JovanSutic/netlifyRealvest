import { DashboardPage } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";
import { getParamValue, isMobile } from "../utils/params";
import MarketCard from "../components/card/MarketCard";
import { LangType, RoleType } from "../types/dashboard.types";
import Pagination from "../components/pagination/index";
import { FinalError } from "../types/component.types";
import {
  MarketFilter as MarketFilterType,
  MarketIndexItem,
  MarketSortType,
  PhotoItem,
} from "../types/market.types";
import { differenceInDays } from "date-fns";
import { makeNumberCurrency } from "../utils/numbers";
import Select from "../components/select/Select";
import MarketFilter from "../components/filters/MarketFilter";
import { useState } from "react";
import {
  calculateIRR,
  getNumberWithDecimals,
  getPropertyPurchaseExpenses,
  getSortingParams,
} from "../utils/market";
import { calculateFuturePrice } from "../utils/dashboard";
import PageLoader from "../components/loader/PageLoader";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translate = new Translator("market");

  return [
    { title: translate.getTranslation(lang, "searchMetaTitle") },
    {
      name: "description",
      content: translate.getTranslation(lang, "searchMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const city = new URL(request.url).searchParams.get("city") || "1";
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const page = new URL(request.url).searchParams.get("page") || "1";
  const sizeFrom = new URL(request.url).searchParams.get("size_from") || "0";
  const sizeTo = new URL(request.url).searchParams.get("size_to") || "1000";
  const priceFrom = new URL(request.url).searchParams.get("price_from") || "0";
  const priceTo =
    new URL(request.url).searchParams.get("price_to") || "30000000";
  const m2PriceFrom =
    new URL(request.url).searchParams.get("m2_price_from") || "0";
  const m2PriceTo =
    new URL(request.url).searchParams.get("m2_price_to") || "15000";
  const rentalAnalysis =
    new URL(request.url).searchParams.get("rental_analysis") || "false";
  const appreciation =
    new URL(request.url).searchParams.get("appreciation") || "-10";
  const cityPart = new URL(request.url).searchParams.get("city_part") || "all";
  const sort = new URL(request.url).searchParams.get("sort") || "date_desc";
  const low_price =
    new URL(request.url).searchParams.get("low_price") || "true";

  const limit = 20;
  const rangeStart = (Number(page) - 1) * limit;
  const userRole = "guest";

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);

    const { data: partsData, error: partsError } = await supabaseClient.rpc(
      "get_distinct_city_part", {city_id: Number(city)}
    );

    if (partsError) {
      isError = true;
      finalError = partsError as FinalError;
    }

    partsData?.unshift("all");

    const { data: countData, error: countError } = await supabaseClient.rpc(
      "get_apartments_count",
      {
        size_from: Number(sizeFrom),
        size_to: Number(sizeTo),
        price_from: Number(priceFrom),
        price_to: Number(priceTo),
        m2_price_from: Number(m2PriceFrom),
        m2_price_to: Number(m2PriceTo),
        rental: rentalAnalysis === "true" ? 2 : 0,
        trend: Number(appreciation) / 100,
        part: cityPart,
        low_price: low_price,
        city_id: city,
      }
    );

    if (countError) {
      isError = true;
      finalError = countError as FinalError;
    }

    const sortingParams = getSortingParams(sort as unknown as MarketSortType);

    const { data: queryData, error: queryError } = await supabaseClient.rpc(
      "get_apartments_with_details_and_profitability",
      {
        p_limit: Number(limit),
        p_offset: Number(rangeStart),
        size_from: Number(sizeFrom),
        size_to: Number(sizeTo),
        price_from: Number(priceFrom),
        price_to: Number(priceTo),
        m2_price_from: Number(m2PriceFrom),
        m2_price_to: Number(m2PriceTo),
        rental: rentalAnalysis === "true" ? 2 : 0,
        trend: Number(appreciation) / 100,
        part: cityPart,
        low_price: low_price,
        city_id: city,
        p_sort_column: sortingParams.column,
        p_sort_order: sortingParams.order,
      }
    );

    if (queryError) {
      isError = true;
      finalError = queryError as FinalError;
    }

    const apartmentIds = queryData?.map((item: MarketIndexItem) => item.id);

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

    const results: MarketIndexItem[] = [];

    (queryData || [])?.forEach((item: MarketIndexItem) => {
      results.push({
        ...item,
        photo: photos[item.id],
      });
    });

    return json({
      data: results,
      cityParts: partsData,
      pages: Math.ceil(countData / limit),
      count: countData,
      mobile: isMobile(userAgent!),
      role: userRole,
    });
  } catch (error) {
    console.log(error);
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return {
    data: [],
    cityParts: [],
    pages: 0,
    count: 0,
    mobile: isMobile(userAgent!),
    role: userRole,
  };
};

const MarketAll = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const translate = new Translator("market");

  const navigation = useNavigation();

  const lang = (searchParams.get("lang") as LangType) || "sr";
  const page = searchParams.get("page") || "1";
  const sizeFrom = searchParams.get("size_from") || "0";
  const sizeTo = searchParams.get("size_to") || "1000";
  const priceFrom = searchParams.get("price_from") || "0";
  const priceTo = searchParams.get("price_to") || "3000000";
  const m2PriceFrom = searchParams.get("m2_price_from") || "0";
  const m2PriceTo = searchParams.get("m2_price_to") || "15000";
  const rentalAnalysis = searchParams.get("rental_analysis") || "false";
  const appreciation = searchParams.get("appreciation") || "0";
  const cityPart = searchParams.get("city_part") || "all";
  const marketSort = searchParams.get("sort") || "date_desc";
  const lowPrice = searchParams.get("low_price") || "true";

  const setFilters = (filters: MarketFilterType) => {
    const params = new URLSearchParams();
    params.set("lang", lang);
    params.set("page", "1");
    params.set("appreciation", filters.appreciation);
    params.set("city_part", filters.cityPart);
    params.set("rental_analysis", filters.rentalAnalysis);
    params.set("m2_price_to", filters.m2PriceTo);
    params.set("m2_price_from", filters.m2PriceFrom);
    params.set("price_to", filters.priceTo);
    params.set("price_from", filters.priceFrom);
    params.set("size_to", filters.sizeTo);
    params.set("size_from", filters.sizeFrom);
    params.set("low_price", filters.lowPrice);
    params.set("sort", marketSort);

    setSearchParams(params, {
      preventScrollReset: true,
    });
    setOpenFilter(false);
  };

  const { data, pages, mobile, role, cityParts, count } = useLoaderData<{
    data: MarketIndexItem[];
    pages: number;
    count: number;
    mobile: boolean;
    role: RoleType;
    cityParts: string[];
  }>();

  return (
    <DashboardPage>
      <PageLoader open={navigation.state === 'loading'} />
      <MarketFilter
        isOpen={openFilter}
        lang={lang}
        filters={{
          sizeFrom,
          sizeTo,
          priceFrom,
          priceTo,
          m2PriceFrom,
          m2PriceTo,
          rentalAnalysis,
          appreciation,
          cityPart,
          lowPrice,
        }}
        cityParts={cityParts}
        toggleOpen={() => setOpenFilter(!openFilter)}
        submit={setFilters}
        mobile={mobile}
        role={role as RoleType}
      />
      <div className="font-[sans-serif] bg-gray-100">
        <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
          <h2 className="text-center text-[24px] md:text-2xl xl:text-3xl font-bold mb-6">
            {translate.getTranslation(lang, "allTitle")}
          </h2>
          <div className="mb-6 pb-4 border-b-[1px] border-gray-300 flex flex-col md:flex-row gap-2 justify-between">
            <div className="flex w-full md:w-[260px]">
              <button
                onClick={() => setOpenFilter(true)}
                className="w-full bg-blue-500 text-white flex flex-row gap-2 justify-center font-semibold leading-[28px] rounded-md px-3 py-1 hover:bg-blue-600 leading-[37px]"
              >
                {`${translate.getTranslation(lang, "filters")} (${count})`}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8 text-center"
                >
                  <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                </svg>
              </button>
            </div>
            <div className="flex w-full md:w-[260px]">
              <Select
                name="marketSort"
                isFullWidth
                value={marketSort}
                setValue={(value) =>
                  setSearchParams((prev) => {
                    prev.set("sort", `${value}`);
                    prev.set("page", "1");
                    return prev;
                  })
                }
                options={[
                  {
                    value: "date_desc",
                    text: translate.getTranslation(lang, "sortDateDesc"),
                  },
                  {
                    value: "date_asc",
                    text: translate.getTranslation(lang, "sortDateAsc"),
                  },
                  {
                    value: "price_desc",
                    text: translate.getTranslation(lang, "sortPriceDesc"),
                  },
                  {
                    value: "price_asc",
                    text: translate.getTranslation(lang, "sortPriceAsc"),
                  },
                  {
                    value: "size_desc",
                    text: translate.getTranslation(lang, "sortSizeDesc"),
                  },
                  {
                    value: "size_asc",
                    text: translate.getTranslation(lang, "sortSizeAsc"),
                  },
                ]}
              />
            </div>
          </div>

          {Number(page) > pages ? (
            <div className="w-full flex flex-col justify-center py-5">
              <p className="text-center text-xl font-bold lg:text-3xl text-gray-800 mb-4">
                {translate.getTranslation(lang, "noPage")}
              </p>
              <p className="text-center text-md text-gray-500 mb-4">
                {translate.getTranslation(lang, "noPageText")}
              </p>
              <Link
                to={`/market?page=1&lang=${lang}`}
                className="w-full underline block text-center text-md text-blue-500"
              >
                {translate.getTranslation(lang, "noPageLink")}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-8 md:gap-6 xl:gap-4">
                {(data || []).map((item) => {
                  return (
                    <MarketCard
                      key={item?.id}
                      link={`${item?.id}?lang=${lang}`}
                      lang={lang}
                      price={makeNumberCurrency(item!.price)}
                      appreciation={item?.profitability_competition_trend || 0}
                      photo={item?.photo?.link || ""}
                      title={`${item?.city_part}, ${item?.size}m2`}
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
                      rent={(item?.profitability_rental_count || 0) > 2}
                      rentPrice={item.profitability_rental_count > 1 ? makeNumberCurrency(
                        item.profitability_average_rental * item.size
                      ) : '0'}
                      duration={`${translate.getTranslation(
                        lang,
                        "onMarket"
                      )} ${
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

              <div className="flex w-full mt-12">
                <Pagination
                  page={Number(page)}
                  total={pages!}
                  onClick={(page: number) =>
                    setSearchParams((prev) => {
                      prev.set("page", `${page}`);
                      return prev;
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardPage>
  );
};

export default MarketAll;
