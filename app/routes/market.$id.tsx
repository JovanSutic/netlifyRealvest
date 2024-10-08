/* eslint-disable react/jsx-no-undef */
import { DashboardPage, WidgetWrapper } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  MetaFunction,
  useLoaderData,
  useSearchParams,
  useNavigate,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";
// import Loader from "../components/loader";
import { getParamValue, detectDevice } from "../utils/params";
import {
  Details,
  LangType,
  ListedAd,
  RoleType,
} from "../types/dashboard.types";
import { jwtDecode } from "jwt-decode";
import { FinalError } from "../types/component.types";
import {
  Profitability,
  PhotoItem,
  MarketSingleType,
  UserRole,
} from "../types/market.types";
import { makeNumberCurrency } from "../utils/numbers";
import Gallery from "../widgets/MarketGallery";
import MarketAppreciationAnalysis from "../widgets/MarketAppreciationAnalysis";
import MarketFlipAnalysis from "../widgets/MarketFlipAnalysis";
import MarketFeatureList from "../widgets/MarketFeatureList";
import MarketRentalAnalysis from "../widgets/MarketRentalAnalysis";
import {
  getRoleForUpsert,
  getSessionUserRole,
  getShortRentalPrice,
  isRoleForUpdate,
} from "../utils/market";
import { getMapCircle } from "../utils/dashboard";
import { ClientOnly } from "../components/helpers/ClientOnly";
import IndexedMap from "../components/map/IndexedMap.client";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { id } = params;

  let userRole = "basic";
  let occupancyLevel = 0;
  let shortRentalM2 = 0;

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const session = await supabaseClient.auth.getSession();

    const decoded = jwtDecode<{ user_role: string; sub: string }>(
      session?.data?.session?.access_token || ""
    );

    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("*")
      .eq("user_id", decoded.sub)
      .limit(1)
      .returns<UserRole[]>();

    if (roleError) {
      isError = true;
      finalError = roleError as FinalError;
    }

    const roleUser = roleData![0];
    userRole = getSessionUserRole(roleUser);

    if (roleUser) {
      if (isRoleForUpdate(roleUser)) {
        const { error: upsertError } = await supabaseClient
          .from("user_roles")
          .upsert(getRoleForUpsert(roleUser));
        if (upsertError) {
          isError = true;
          finalError = upsertError as FinalError;
        }
      }
    }

    const { data: apartmentData, error: apartmentError } = await supabaseClient
      .from("apartments")
      .select("*")
      .eq("id", id)
      .limit(1)
      .returns<ListedAd[]>();

    if (apartmentError) {
      isError = true;
      finalError = apartmentError as FinalError;
    }

    const { data: profitData, error: profitError } = await supabaseClient
      .from("ad_profitability")
      .select("*")
      .eq("ad_id", id)
      .limit(1)
      .returns<Profitability[]>();

    if (profitError) {
      isError = true;
      finalError = profitError as FinalError;
    }

    const { data: detailData, error: detailError } = await supabaseClient
      .from("ad_details")
      .select("*")
      .eq("ad_id", id)
      .limit(1)
      .returns<Details[]>();

    if (detailError) {
      isError = true;
      finalError = detailError as FinalError;
    }

    const { uniq } = getMapCircle(
      Number(detailData![0].lat),
      Number(detailData![0].lng),
      200
    );

    const { data: shortsData, error: shortsError } = await supabaseClient
      .from("short_rentals")
      .select("*")
      .gt("lat", 0)
      .gt("lng", 0)
      .gt("lat", uniq[1])
      .lt("lat", uniq[0])
      .gt("lng", uniq[3])
      .lt("lng", uniq[2]);

    if (shortsError) {
      isError = true;
      finalError = shortsError as FinalError;
    }

    if (shortsData && shortsData.length) {
      const { count: shortsCount, error: shortsCountError } =
        await supabaseClient
          .from("short_calendar")
          .select("*", { count: "exact", head: true });

      if (shortsCountError) {
        isError = true;
        finalError = shortsCountError as FinalError;
      }

      const ids = shortsData.map((item) => item.id);

      const { data: calendarData, error: calendarError } =
        await supabaseClient.rpc("get_matching_short_calendar", { ids });

      if (calendarError) {
        isError = true;
        finalError = calendarError as FinalError;
      }

      occupancyLevel = calendarData.length / shortsCount!;
      const sumPrice = shortsData
        ?.map((item) => item.price)
        .reduce((a, b) => a + b, 0);
      const sumSize = shortsData
        ?.map((item) => item.size)
        .reduce((a, b) => a + b, 0);

      shortRentalM2 = sumPrice / sumSize;
    }

    const { data: photoData, error: photoError } = await supabaseClient
      .from("photos")
      .select("*")
      .eq("apartment_id", id)
      .returns<PhotoItem[]>();

    if (photoError) {
      isError = true;
      finalError = apartmentError as FinalError;
    }

    return json({
      data: {
        ...apartmentData![0],
        photos: photoData || [],
        profit: profitData?.[0],
        details: detailData?.[0],
        short: {
          occupancyLevel,
          price: getShortRentalPrice(shortRentalM2, apartmentData![0].size),
        },
      },
      device: detectDevice(userAgent!),
      role: userRole,
    });
  } catch (error) {
    console.log(error);
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return {
    data: {},
    device: detectDevice(userAgent!),
    role: userRole,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const loaderData = data!.data as MarketSingleType;
  const translate = new Translator("dashboard");

  return [
    {
      title: `${loaderData.city}, ${loaderData.city_part}, ${loaderData.size}, ${loaderData.price}`,
    },
    {
      name: "description",
      content: translate.getTranslation(lang, "singleMetaDesc"),
    },
  ];
};

const MarketSingle = () => {
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { data, device, role } = useLoaderData<{
    data: MarketSingleType;
    device: string;
    role: RoleType;
  }>();

  const translate = new Translator("market");

  return (
    <DashboardPage>
      <div className="w-full pt-2 pb-6">
        <div className="w-full mb-3 md:mb-2 flex flex-row-reverse">
          <button
            type="button"
            onClick={goBack}
            className="text-blue-500 text-md underline"
          >
            {translate.getTranslation(lang, "back")}
          </button>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            <span className="text-gray-700">{`${data.city_part}, ${data.size}m2,`}</span>
            <span className="text-blue-500 ml-2">{`${makeNumberCurrency(
              data.price
            )}`}</span>
          </h2>
        </div>
        <Gallery photos={data.photos} device={device} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 md:mt-4 lg:mt-5 mb-3 lg:mb-0">
          <WidgetWrapper>
            <MarketAppreciationAnalysis
              price={data.price}
              size={data.size}
              average={data.average_price!}
              trend={data.profit?.competition_trend || 0}
              lang={lang}
              isMobile={device === "mobile"}
              role={role}
            />
          </WidgetWrapper>
          <WidgetWrapper>
            <MarketFlipAnalysis
              average={data.average_price!}
              data={data as unknown as MarketSingleType}
              lang={lang}
              isMobile={device === "mobile"}
              role={role}
            />
          </WidgetWrapper>
          <WidgetWrapper>
            <MarketRentalAnalysis
              price={data.price}
              data={data as unknown as MarketSingleType}
              lang={lang}
              isMobile={device === "mobile"}
              role={role}
            />
          </WidgetWrapper>
        </div>
        <div className="grid grid-cols-1">
          <WidgetWrapper>
            <MarketFeatureList details={data.details} lang={lang} />
          </WidgetWrapper>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
          <div className="col-span-2">
            <WidgetWrapper>
              <div>
                <div className="border-b-[1px] border-gray-400 mb-3">
                <h3 className="text-[22px] md:text-lg font-bold mb-2">
                  {translate.getTranslation(lang, "distanceTitle")}
                </h3>
                <p className="text-md font-light text-gray-800 mb-3">
                  {translate.getTranslation(lang, "distanceText")}
                </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem1")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem2")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem3")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem4")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem5")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem6")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem7")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem8")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem9")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem10")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem11")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem12")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem13")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem14")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem15")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem16")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem17")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem18")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                    <p className="text-sm font-regular mb-1">
                      <strong>
                        {translate.getTranslation(lang, "distanceItem19")}
                      </strong>{" "}
                      100m, 1 minut vožnje
                    </p>
                  </div>
                </div>
              </div>
            </WidgetWrapper>
          </div>
          <div>
            <WidgetWrapper>
              <ClientOnly
                fallback={
                  <div
                    id="skeleton"
                    style={{ height: "100%", background: "#d1d1d1" }}
                  />
                }
              >
                {() => (
                  <IndexedMap
                    position={[data.details.lat, data.details.lng]}
                    popText={`${data.city_part}, ${data.size}m2`}
                  />
                )}
              </ClientOnly>
            </WidgetWrapper>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
};

export default MarketSingle;
