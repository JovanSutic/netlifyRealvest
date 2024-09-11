import { DashboardPage, WidgetWrapper } from "../components/layout";
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
import { getParamValue, detectDevice } from "../utils/params";
import { Details, LangType, ListedAd } from "../types/dashboard.types";
import { jwtDecode } from "jwt-decode";
import { FinalError } from "../types/component.types";
import { Profitability, PhotoItem } from "../types/market.types";
import { makeNumberCurrency } from "../utils/numbers";
import Gallery from "../widgets/MarketGallery";
import MarketAppreciationAnalysis from "../widgets/MarketAppreciationAnalysis";

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { id } = params;

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

const MarketSingle = () => {
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const page = searchParams.get("fromPage") || "1";

  const { data, device } = useLoaderData<{
    data: ListedAd & {
      details: Details;
      photos: PhotoItem[];
      profit: Profitability;
    };
    device: string;
  }>();

  const translate = new Translator("market");

  return (
    <DashboardPage>
      <div className="w-full pt-2 pb-6">
        <div className="w-full mb-4 md:mb-2 flex flex-row-reverse">
          <Link
            to={`/market?page=${page}&lang=${lang}`}
            className="text-blue-500 text-md underline"
          >
            {translate.getTranslation(lang, 'back')}
          </Link>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            <span className="text-gray-700">{`${data.city_part}, ${data.size}m2,`}</span>
            <span className="text-blue-500 ml-2">{`${makeNumberCurrency(
              data.price
            )}`}</span>
          </h2>
        </div>
        <Gallery photos={data.photos} device={device} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          <WidgetWrapper>
            <MarketAppreciationAnalysis
              price={data.price}
              size={data.size}
              average={data.average_price!}
              trend={data.profit.competitionTrend}
              lang={lang}
              isMobile={device === 'mobile'}
            />
          </WidgetWrapper>
          <WidgetWrapper>
            <div>Flip analysis</div>
          </WidgetWrapper>
          <WidgetWrapper>
            <div>Rental analysis</div>
          </WidgetWrapper>
        </div>
      </div>
    </DashboardPage>
  );
};

export default MarketSingle;
