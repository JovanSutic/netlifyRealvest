import { DashboardPage } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData, useSearchParams } from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";
// import Loader from "../components/loader";
import { getParamValue, isMobile } from "../utils/params";
import MarketCard from "../components/card/MarketCard";
import { Details, LangType } from "../types/dashboard.types";
import Pagination from "../components/pagination/index";
import { jwtDecode } from "jwt-decode";
import { FinalError } from "../types/component.types";
import { Profitability, MarketItem, PhotoItem } from "../types/market.types";
import { intervalToDuration } from "date-fns";
import { formatHighLightValue, getPropertyHighlight } from "../utils/market";
import { makeNumberCurrency } from "../utils/numbers";

const orderData = (data: Details[] | Profitability[]) => {
  const result: Record<string, Partial<Details | Profitability>> = {};
  data.forEach((item) => {
    result[item.ad_id as unknown as string] = item;
  });

  return result;
};

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

    const {
      data: profitabilityData,
      error: profitabilityError,
      count: profitabilityCount,
    } = await supabaseClient
      .from("ad_profitability")
      .select("*", { count: "exact" })
      .eq("ad_type", "apartment")
      .order("ad_type")
      .range(rangeStart, rangeStart + limit)
      .returns<Profitability[]>();

    if (profitabilityError) {
      isError = true;
      finalError = profitabilityError as FinalError;
    }

    const apartmentIds: number[] = [];
    profitabilityData?.forEach((item) => {
      apartmentIds.push(item.ad_id);
    });

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
      if(photos[item.apartment_id as string] === undefined) {
        photos[item.apartment_id] = item
      }
    })

    const { data: adsData, error: adsError } = await supabaseClient
      .from("apartments")
      .select("id, city_part, date_signed, price, size, room_number")
      .in("id", apartmentIds)
      .order("id")
      .limit(20)

    if (adsError) {
      isError = true;
      finalError = adsError as FinalError;
    }

    const { data: detailData, error: detailError } = await supabaseClient
      .from("ad_details")
      .select("id, ad_id, type, lat, lng, built_state, built_year")
      .in("ad_id", apartmentIds)
      .order("id")
      .limit(limit)
      .returns<Details[]>();

    if (detailError) {
      isError = true;
      finalError = detailError as FinalError;
    }

    const details = orderData(detailData!);
    const profitability = orderData(profitabilityData!);

    const results: MarketItem[] = [];

    adsData?.forEach((item) => {
      results.push({
        ...item,
        details: details[item.id],
        profitability: profitability[item.id],
        photo: photos[item.id]
      });
    });

    return json({
      data: results,
      pages: Math.round((profitabilityCount || 0) / limit),
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

  console.log(data.length)

  return (
    <DashboardPage>
      <div className="font-[sans-serif] bg-gray-100">
        <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
          <h2 className="text-center text-xl md:text-2xl xl:text-3xl font-bold mb-6">
            {translate.getTranslation(lang, "allTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
            {data.map((item) => {
              const duration = intervalToDuration({
                start: item?.date_signed || "",
                end: new Date(),
              });

              const highlight = getPropertyHighlight(item!);

              return (
                <MarketCard
                  key={item?.id}
                  link={`${item?.id}?lang=${lang}`}
                  price={makeNumberCurrency(item!.price)}
                  highlight={translate.getTranslation(
                    lang,
                    `${highlight.type}Highlight`
                  )}
                  value={formatHighLightValue(highlight)}
                  photo={item?.photo?.link || ''}
                  title={`${item?.city_part}, ${item?.size}m2`}
                  duration={`${translate.getTranslation(lang, "onMarket")} ${
                    duration.days
                  } ${translate.getTranslation(lang, "days")}`}
                />
              );
            })}
          </div>

          <div className="flex w-full mt-12">
            <Pagination
              page={Number(page)}
              total={pages!}
              totalText={translate.getTranslation(lang, "paginationTotal")}
              onClick={(page: number) =>
                setSearchParams((prev) => {
                  prev.set("page", `${page}`);
                  return prev;
                })
              }
            />
          </div>
        </div>
      </div>
    </DashboardPage>
  );
};

export default MarketAll;
