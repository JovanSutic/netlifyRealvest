import { DashboardPage, WidgetWrapper } from "../components/layout";
import { point, booleanIntersects } from "@turf/turf";
import Map from "../components/map/index.client";
import { ClientOnly } from "../components/helpers/ClientOnly";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import Select from "../components/select/Select";
import { useEffect, useState } from "react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import {
  AreaReportType,
  DashboardRentalType,
  DashboardSearchType,
  LangType,
  PropertyType,
} from "../types/dashboard.types";
import {
  RangeOption,
  getDbDateString,
  getLastRecordedReportDate,
} from "../utils/dateTime";
import { Translator } from "../data/language/translator";
import {
  cyrillicToLatin,
  fetchData,
  generateAreaReport,
  getMapCircle,
  transformDashboardRental,
} from "../utils/dashboard";
import AreaReport from "../widgets/AreaReport";
import Loader from "../components/loader";
import Tabs from "../components/tabs";
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
// import AreaDoughnutTimeReport from "../widgets/AreaDoughnutTimeReport";
import { format } from "date-fns";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const lat = new URL(request.url).searchParams.get("lat");
  const lng = new URL(request.url).searchParams.get("lng");
  const range = new URL(request.url).searchParams.get("range");
  const searchRange = new URL(request.url).searchParams.get("time_range");
  const searchType = new URL(request.url).searchParams.get(
    "property_type"
  ) as PropertyType;

  if (lat && lng && range && searchType) {
    const { uniq, circle } = getMapCircle(
      Number(lat),
      Number(lng),
      Number(range)
    );

    try {
      const { supabaseClient } = createSupabaseServerClient(request);

      const today = new Date();
      const startDate = getLastRecordedReportDate(
        (searchRange || "3m") as RangeOption,
        format(today, "yyyy-MM-dd")
      );

      const { data, error } = await supabaseClient
        .from("apartments_archive")
        .select(
          `id, name, city, price, date_created, size, city_part, link_id (lat, lng, description)`
        )
        .eq("type", "rental")
        .not("link_id", "is", null)
        .gt("date_created", getDbDateString(startDate!, "en"))
        .gt("link_id.lat", 0)
        .gt("link_id.lng", 0)
        .gt("link_id.lat", uniq[1])
        .lt("link_id.lat", uniq[0])
        .gt("link_id.lng", uniq[3])
        .lt("link_id.lng", uniq[2])
        .returns<DashboardRentalType[]>();
      if (error) {
        throw new Response("Archive data error.", {
          status: 500,
        });
      }

      const finalData = (data || []).map((item) => {
        const inter = point([item.link_id.lat, item.link_id.lng]);
        const isPointInCircle = booleanIntersects(inter, circle.geometry);
        if (isPointInCircle) {
          return transformDashboardRental(item, searchType);
        }
      }).filter((item) => item !== undefined);

      const locationData = await fetchData(
        `https://nominatim.openstreetmap.org/search.php?q=${lat}+${lng}&format=jsonv2`
      );

      return json({
        data: generateAreaReport(
          finalData as unknown as DashboardSearchType[],
          cyrillicToLatin(locationData[0].display_name)
        ),
        list: finalData as unknown as DashboardSearchType[],
      });
    } catch (error) {
      // throw new Error(error);
      console.log(error);
    }
  }

  return null;
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

  const fetcher = useFetcher<{
    data: AreaReportType;
    list: DashboardSearchType[];
  }>({
    key: "search_rentals",
  });

  useEffect(() => {
    if (center) {
      const [lat, lng] = center;
      fetcher.load(
        `/dashboard/rental?lat=${lat}&lng=${lng}&city=1&range=${range}&time_range=${timeRange}&property_type=${propertyType}`
      );
    }
  }, [center, range, timeRange, propertyType]);

  console.log(fetcher?.data);

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
      <div className="grid grid-cols-12 lg:grid-rows-1 gap-4 pt-5 lg:pt-0">
        <div className="col-span-12 lg:col-span-7 lg:row-start-2">
          <WidgetWrapper>
            <Loader open={fetcher.state === "loading"} />
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">
                {translate.getTranslation(lang, "searchTitle")}
              </h2>
              <p className="text-md text-slate-700">
                {translate.getTranslation(lang, "searchDescription")}
              </p>
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
            <div className="grid grid-cols-3 grid-rows-1 gap-1 mt-8">
              <div>
                <label
                  htmlFor="mapCity"
                  className="text-slate-600 ml-2 text-sm"
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
                        text: `250 ${translate.getTranslation(lang, "meters")}`,
                      },
                      {
                        value: "500",
                        text: `500 ${translate.getTranslation(lang, "meters")}`,
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
              <div>
                <label
                  htmlFor="mapCity"
                  className="text-slate-600 ml-2 text-sm"
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
                  ]}
                />
              </div>

              <div>
                <label
                  htmlFor="propertyType"
                  className="text-slate-600 ml-2 text-sm"
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
                      text: reportTranslate.getTranslation(
                        lang!,
                        "parkingType"
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </WidgetWrapper>
        </div>
        <div className="col-span-12 lg:col-span-5 col-start-1 lg:col-start-8 lg:row-start-2">
          <WidgetWrapper>
            <Loader open={fetcher.state === "loading"} />
            <Tabs
              options={[
                {
                  text: translate.getTranslation(lang, "tabReport"),
                  value: "1",
                },
                {
                  text: translate.getTranslation(lang, "tabLine"),
                  value: "2",
                },
                {
                  text: translate.getTranslation(lang, "tabDoughnut"),
                  value: "3",
                },
                // {
                //   text: translate.getTranslation(lang, "tabDoughnutTime"),
                //   value: "4",
                // },
              ]}
              value={tab}
              onChange={(value) => {
                setTab(value);
              }}
            />
            <div className="mt-4">
              {tab === "1" && (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-700">
                      {translate.getTranslation(lang, "areaDescription")}
                    </p>
                  </div>
                  <div>
                    {center ? (
                      <AreaReport data={fetcher.data?.data} lang={lang} />
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
                  date={""}
                />
              )}
              {tab === "3" && (
                <AreaDoughnutReport
                  isShown={center !== undefined}
                  data={fetcher.data?.list || []}
                  lang={lang}
                  propertyType={propertyType}
                  rental
                />
              )}
              {/* {tab === "4" && (
                <AreaDoughnutTimeReport
                  isShown={center !== undefined}
                  data={fetcher.data?.list || []}
                  lang={lang}
                  timeRange={timeRange}
                  date={""}
                />
              )} */}
            </div>
          </WidgetWrapper>
        </div>
      </div>
    </DashboardPage>
  );
};

export default DashboardSearch;
