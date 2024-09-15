import { DashboardPage } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";
// import Loader from "../components/loader";
import { getParamValue, isMobile } from "../utils/params";
import MarketCard from "../components/card/MarketCard";
import { LangType } from "../types/dashboard.types";
import Pagination from "../components/pagination/index";
import { jwtDecode } from "jwt-decode";
import { FinalError } from "../types/component.types";
import { MarketIndexItem, PhotoItem } from "../types/market.types";
import { intervalToDuration } from "date-fns";
import { getNumberWithDecimals } from "../utils/market";
import { makeNumberCurrency } from "../utils/numbers";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translate = new Translator("dashboard");

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
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const page = new URL(request.url).searchParams.get("page") || "1";

  const limit = 20;
  const rangeStart = (Number(page) - 1) * limit;
  let userRole = "basic";

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const session = await supabaseClient.auth.getSession();

    const decoded = jwtDecode<{ user_role: string }>(
      session?.data?.session?.access_token || ""
    );
    userRole = decoded?.user_role;

    const { data: countData, error: countError } = await supabaseClient.rpc(
      "get_apartments_count"
    );

    if (countError) {
      isError = true;
      finalError = countError as FinalError;
    }

    const { data: queryData, error: queryError } = await supabaseClient.rpc(
      "get_apartments_with_details_and_profitability",
      { p_limit: limit, p_offset: rangeStart }
    )

    if (queryError) {
      isError = true;
      finalError = queryError as FinalError;
    }

    const apartmentIds = queryData.map((item: MarketIndexItem) => item.id);

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
      pages: Math.round(countData / limit),
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
    pages: 0,
    mobile: isMobile(userAgent!),
    role: userRole,
  };
};

const MarketAll = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const page = (searchParams.get("page") as LangType) || "1";

  const translate = new Translator("market");

  const { data, pages } = useLoaderData<typeof loader>();

  console.log(data);

  return (
    <DashboardPage>
      <div className="font-[sans-serif] bg-gray-100">
        <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
          <h2 className="text-center text-xl md:text-2xl xl:text-3xl font-bold mb-6">
            {translate.getTranslation(lang, "allTitle")}
          </h2>

          {Number(page) > pages ? (
            <div className="w-full flex flex-col justify-center py-5">
              <h3 className="text-center text-md xl:text-lg text-gray-500 mb-4">
                {translate.getTranslation(lang, "noPage")}
              </h3>
              <Link
                to={`/market?page=1&lang=${lang}`}
                className="w-full underline block text-center text-md text-blue-500"
              >
                Početna stranica tržišta
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-8 md:gap-6 xl:gap-4">
                {data.map((item) => {
                  const duration = intervalToDuration({
                    start: item?.date_signed || "",
                    end: new Date(),
                  });

                  return (
                    <MarketCard
                      key={item?.id}
                      link={`${item?.id}?lang=${lang}&fromPage=${page}`}
                      lang={lang}
                      price={makeNumberCurrency(item!.price)}
                      appreciation={`${getNumberWithDecimals(
                        (item?.profitability_competition_trend || 0) * 100,
                        2
                      )}%`}
                      photo={item?.photo?.link || ""}
                      title={`${item?.city_part}, ${item?.size}m2`}
                      rent={(item?.profitability_rental_count || 0) > 2}
                      duration={`${translate.getTranslation(
                        lang,
                        "onMarket"
                      )} ${duration.days} ${translate.getTranslation(
                        lang,
                        "days"
                      )}`}
                    />
                  );
                })}
              </div>

              <div className="flex w-full mt-12">
                <Pagination
                  page={Number(page)}
                  total={pages!}
                  title={translate.getTranslation(lang, "page")}
                  totalText={translate.getTranslation(lang, "paginationTotal")}
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
