import { DashboardPage, WidgetWrapper } from "../components/layout";
import { point, booleanIntersects } from "@turf/turf";
import Map from "../components/map/index.client";
import { ClientOnly } from "../components/helpers/ClientOnly";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import Select from "../components/select/Select";
import { useEffect, useRef, useState } from "react";
import {
  MetaFunction,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import {
  AreaReportType,
  DashboardSearchType,
  LangType,
  PropertyType,
} from "../types/dashboard.types";
import {
  RangeOption,
  formatDate,
  getDbDateString,
  getLastRecordedReportDate,
} from "../utils/dateTime";
import { Translator } from "../data/language/translator";
import {
  cyrillicToLatin,
  extractAddress,
  fetchData,
  generateAreaReport,
  getMapCircle,
  setSubtypeGroup,
} from "../utils/dashboard";
import AreaReport from "../widgets/AreaReport";
import Loader from "../components/loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import AreaLineReport from "../widgets/AreaLineReport";
import AreaDoughnutReport from "../widgets/AreaDoughnutReport";
import AreaDoughnutTimeReport from "../widgets/AreaDoughnutTimeReport";
import { getParamValue, isMobile } from "../utils/params";
import { default as LocalTooltip } from "../components/tooltip/Tooltip";
import { FinalError } from "../types/component.types";
import ChipsGroupItem from "../components/chip/ChipsGroup";

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
  const lat = new URL(request.url).searchParams.get("lat");
  const lng = new URL(request.url).searchParams.get("lng");
  const range = new URL(request.url).searchParams.get("range");
  const searchRange = new URL(request.url).searchParams.get("time_range");
  const searchType = new URL(request.url).searchParams.get(
    "property_type"
  ) as PropertyType;

  const searchTypeMap: Record<PropertyType, string> = {
    residential: "apartment",
    parking: "garage",
    commercial: "commercial",
  };

  let isError = false;
  let finalError: FinalError | null = null;

  if (lat && lng && range && searchType) {
    const { uniq, circle } = getMapCircle(
      Number(lat),
      Number(lng),
      Number(range)
    );

    try {
      const { supabaseClient } = createSupabaseServerClient(request);

      const { data: lastData, error: lastError } = await supabaseClient
        .from("contracts")
        .select("id, date")
        .limit(1)
        .order("date", { ascending: false });

      if (lastError) {
        isError = true;
        finalError = lastError as FinalError;
      }

      const startDate = getLastRecordedReportDate(
        (searchRange || "3m") as RangeOption,
        lastData![0].date
      );

      const { data, error } = await supabaseClient
        .from("contracts")
        .select(`id, lng, lat, municipality, city, price, size, type, date`)
        .eq("type", `${searchTypeMap[searchType]}`)
        .eq("for_view", true)
        .in("subtype", setSubtypeGroup(searchType))
        .gt("date", getDbDateString(startDate!, "en"))
        .gt("lat", uniq[1])
        .lt("lat", uniq[0])
        .gt("lng", uniq[3])
        .lt("lng", uniq[2])
        .order("date")
        .returns<DashboardSearchType[]>();
      if (error) {
        isError = true;
        finalError = error as FinalError;
      }
      const finalData = (data || []).filter((item) => {
        const inter = point([item.lat, item.lng]);
        const isPointInCircle = booleanIntersects(inter, circle.geometry);
        if (isPointInCircle) return item;
      });

      const locationData = await fetchData(
        `https://nominatim.openstreetmap.org/search.php?q=${lat}+${lng}&format=jsonv2`
      );

      return json({
        data: generateAreaReport(
          finalData,
          extractAddress(cyrillicToLatin(locationData[0].display_name))
        ),
        list: finalData,
        lastDate: lastData![0].date,
        mobile: isMobile(userAgent!),
      });
    } catch (error) {
      isError = true;
      finalError = error as FinalError;
    }
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return json({
    data: [],
    list: [],
    lastDate: "",
    mobile: isMobile(userAgent!),
  });
};

const DashboardSearch = () => {
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const [range, setRange] = useState<string>("250");
  const [center, setCenter] = useState<number[]>();
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [timeRange, setTimeRange] = useState<RangeOption>("3m");
  const [tab, setTab] = useState<string>("1");

  const reportTranslate = new Translator("report");
  const translate = new Translator("dashboard");
  const { mobile } = useLoaderData<typeof loader>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const executeScroll = () =>
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const fetcher = useFetcher<{
    data: AreaReportType;
    list: DashboardSearchType[];
    lastDate: string;
  }>({
    key: "search_contracts",
  });

  useEffect(() => {
    if (JSON.stringify(fetcher?.data?.list) !== undefined && mobile) {
      executeScroll();
    }
  }, [JSON.stringify(fetcher?.data?.list)]);

  useEffect(() => {
    if (center) {
      const [lat, lng] = center;
      fetcher.load(
        `/dashboard/search?lat=${lat}&lng=${lng}&city=1&range=${range}&time_range=${timeRange}&property_type=${propertyType}`
      );
    }
  }, [center, range, timeRange, propertyType]);

  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );
  }, []);

  return (
    <DashboardPage>
      <div className="grid grid-cols-12 gap-4 pt-5 lg:pt-0">
        <div className="row-start-1 col-span-12 xl:col-span-7 lg:row-start-1">
          <div className="my-0 xl:my-2 flex h-full flex-row items-center">
            <h2 className="text-center xl:text-left text-2xl font-semibold">
              {translate.getTranslation(lang, "searchTitle")}
            </h2>
          </div>
        </div>
        <div className="row-start-2 col-span-12 xl:col-span-5 lg:row-start-1">
          <div className="grid grid-cols-12 xl:grid-cols-3 grid-rows-1 gap-4 col-start-1 xl:col-start-2 mt-0 xl:mt-4">
            <div className="col-span-6 xl:col-span-1 xl:col-start-2">
              <label
                htmlFor="mapCity"
                className="text-slate-800 ml-1 text-sm font-semibold"
              >
                {translate.getTranslation(lang, "timeRange")}
              </label>
              <Select
                name="timeRange"
                value={timeRange}
                isFullWidth={true}
                setValue={(value) => {
                  setTimeRange(value as RangeOption);
                }}
                options={[
                  {
                    value: "3m",
                    text: translate.getTranslation(lang, "3m"),
                  },
                  {
                    value: "6m",
                    text: translate.getTranslation(lang, "6m"),
                  },
                  {
                    value: "1y",
                    text: translate.getTranslation(lang, "1y"),
                  },
                  {
                    value: "3y",
                    text: translate.getTranslation(lang, "3y"),
                  },
                  {
                    value: "5y",
                    text: translate.getTranslation(lang, "5y"),
                  },
                ]}
              />
            </div>
            <div className="col-span-6 xl:col-span-1 col-start-7 xl:col-start-3">
              <label
                htmlFor="propertyType"
                className="text-slate-800 ml-1 text-sm font-semibold"
              >
                {translate.getTranslation(lang, "propertyType")}
              </label>
              <Select
                name="propertyType"
                value={propertyType!}
                isFullWidth={true}
                setValue={(value) => {
                  setPropertyType(value as PropertyType);
                }}
                options={[
                  {
                    value: "residential",
                    text: reportTranslate.getTranslation(
                      lang!,
                      "residentialType"
                    ),
                  },
                  {
                    value: "commercial",
                    text: reportTranslate.getTranslation(
                      lang!,
                      "commercialType"
                    ),
                  },
                  {
                    value: "parking",
                    text: reportTranslate.getTranslation(lang!, "parkingType"),
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="row-start-3 col-span-12 lg:col-span-7 lg:row-start-2">
          <WidgetWrapper>
            <Loader open={fetcher.state === "loading"} />
            <div className="grid grid-cols-3 grid-rows-1 gap-1 mb-4">
              {mobile ? (
                <>
                  <div className="col-span-3 col-start-1 xl:col-span-1 xl:col-start-3">
                    <div className="flex flex-row-reverse">
                      <div className="w-[30px]">
                        <LocalTooltip
                          text={translate.getTranslation(
                            lang,
                            "searchDescription"
                          )}
                          style="top"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                          </svg>
                        </LocalTooltip>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 col-start-1 lg:col-start-1 lg:col-span-1">
                    <div>
                      <label
                        htmlFor="mapCity"
                        className="text-slate-800 ml-1 text-sm font-semibold"
                      >
                        {translate.getTranslation(lang, "areaRange")}
                      </label>
                      <div className="width-44">
                        <Select
                          name="mapRange"
                          value={range}
                          isFullWidth={true}
                          setValue={(value) => {
                            setRange(value);
                          }}
                          options={[
                            {
                              value: "250",
                              text: `250 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "500",
                              text: `500 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "1000",
                              text: `1000 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "1500",
                              text: `1500 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "2000",
                              text: `2000 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-3 col-start-1 lg:col-start-1 lg:col-span-1">
                    <div>
                      <label
                        htmlFor="mapCity"
                        className="text-slate-800 ml-1 text-sm font-semibold"
                      >
                        {translate.getTranslation(lang, "areaRange")}
                      </label>
                      <div className="width-44">
                        <Select
                          name="mapRange"
                          value={range}
                          isFullWidth={true}
                          setValue={(value) => {
                            setRange(value);
                          }}
                          options={[
                            {
                              value: "250",
                              text: `250 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "500",
                              text: `500 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "1000",
                              text: `1000 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "1500",
                              text: `1500 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                            {
                              value: "2000",
                              text: `2000 ${translate.getTranslation(
                                lang,
                                "meters"
                              )}`,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 col-start-1 xl:col-span-1 xl:col-start-3">
                    <div className="flex flex-row-reverse">
                      <div className="w-[30px]">
                        <LocalTooltip
                          text={translate.getTranslation(
                            lang,
                            "searchDescription"
                          )}
                          style="top"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                          </svg>
                        </LocalTooltip>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <ClientOnly
              fallback={
                <div
                  id="skeleton"
                  style={{ height: "100%", background: "#d1d1d1" }}
                />
              }
            >
              {() => <Map range={Number(range)} setCenter={setCenter} />}
            </ClientOnly>
          </WidgetWrapper>
        </div>
        <div
          ref={scrollRef}
          className="row-start-4 col-span-12 lg:col-span-5 col-start-1 lg:col-start-8 lg:row-start-2 mb-6"
        >
          <WidgetWrapper>
            <Loader open={fetcher.state === "loading"} />
            <ChipsGroupItem
              data={[
                {text: translate.getTranslation(lang, "tabReport"), value: "1", onClick: () => setTab("1") },
                {text: translate.getTranslation(lang, "tabLine"), value: "2", onClick: () => setTab("2") },
                {text: translate.getTranslation(lang, "tabDoughnut"), value: "3", onClick: () => setTab("3") },
                {text: translate.getTranslation(lang, "tabDoughnutTime"), value: "4", onClick: () => setTab("4") },
              ]}
              current={tab}
              mobile={mobile}
            />
            <div className="mt-1">
              {tab === "1" && (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-700">
                      {(fetcher.data?.list || []).length > 0 &&
                        translate.getTranslation(lang, "areaDescription")}
                    </p>
                  </div>
                  <div>
                    {center ? (
                      <AreaReport data={fetcher.data?.data} lang={lang} mobile={mobile} />
                    ) : (
                      <div>
                        <div className="flex flex-column w-full justify-center h-[200px]">
                          <p className="flex items-center text-center text-slate-400 font-sm">
                            {translate.getTranslation(lang, "areaNoData")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {tab === "2" && (
                <AreaLineReport
                  isLine={center !== undefined}
                  data={fetcher.data?.list || []}
                  lang={lang}
                  timeRange={timeRange}
                  date={fetcher.data?.lastDate || ""}
                  mobile={mobile}
                />
              )}
              {tab === "3" && (
                <AreaDoughnutReport
                  isShown={center !== undefined}
                  data={fetcher.data?.list || []}
                  lang={lang}
                  propertyType={propertyType}
                  mobile={mobile}
                />
              )}
              {tab === "4" && (
                <AreaDoughnutTimeReport
                  isShown={center !== undefined}
                  data={fetcher.data?.list || []}
                  lang={lang}
                  timeRange={timeRange}
                  date={fetcher.data?.lastDate || ""}
                  mobile={mobile}
                />
              )}
            </div>
          </WidgetWrapper>
          <p className="mt-4 text-sm font-serif text-right pr-4">
            {fetcher.data?.lastDate
              ? `${translate.getTranslation(
                  lang!,
                  "lastInputDate"
                )} ${formatDate(fetcher.data?.lastDate, lang!)}`
              : ""}
          </p>
        </div>
      </div>
    </DashboardPage>
  );
};

export default DashboardSearch;
