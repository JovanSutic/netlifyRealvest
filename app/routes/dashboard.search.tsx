import { DashboardPage, WidgetWrapper } from "../components/layout";
import { point, booleanIntersects } from "@turf/turf";
import Map from "../components/map/index.client";
import { ClientOnly } from "../components/helpers/ClientOnly";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MetaFunction,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import {
  AppreciationData,
  AreaReportType,
  DashboardRentalType,
  DashboardSearchType,
  FiltersType,
  LangType,
  PropertyType,
  RentalPropertyType,
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
  getAppreciationData,
  getMapCircle,
  setSubtypeGroup,
  transformDashboardRental,
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
import { format } from "date-fns";
import AppreciateReport from "../widgets/AppreciateReport";
import Filters from "../components/filters";
import FiltersDisplay from "../components/filters/FiltersDisplay";

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
  const appreciateParam = new URL(request.url).searchParams.get("appreciate");
  const rentalParam = new URL(request.url).searchParams.get("rental");
  const searchType = new URL(request.url).searchParams.get(
    "property_type"
  ) as PropertyType;

  const searchTypeMap: Record<PropertyType, string> = {
    residential: "apartment",
    parking: "garage",
    commercial: "commercial",
  };

  const searchRentalTypeMap: Record<PropertyType, RentalPropertyType> = {
    residential: "rental",
    parking: "garage_rental",
    commercial: "commercial_rental",
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

      let finalRentalData = null;

      if (rentalParam === "0") {
        const today = new Date();
        const startDateRental = getLastRecordedReportDate(
          "1y" as RangeOption,
          format(today, "yyyy-MM-dd")
        );

        const { data: rentalData, error: rentalError } = await supabaseClient
          .from("apartments_archive")
          .select(
            `id, name, city, price, date_created, size, city_part, link_id (lat, lng)`
          )
          .eq("type", searchRentalTypeMap[searchType])
          .eq("is_active", false)
          .not("link_id", "is", null)
          .gt("date_created", getDbDateString(startDateRental!, "en"))
          .gt("link_id.lat", 0)
          .gt("link_id.lng", 0)
          .gt("link_id.lat", uniq[1])
          .lt("link_id.lat", uniq[0])
          .gt("link_id.lng", uniq[3])
          .lt("link_id.lng", uniq[2])
          .returns<DashboardRentalType[]>();

        if (rentalError) {
          isError = true;
          finalError = rentalError as FinalError;
        }

        finalRentalData = (rentalData || [])
          .map((item) => {
            const inter = point([item.link_id.lat, item.link_id.lng]);
            const isPointInCircle = booleanIntersects(inter, circle.geometry);
            if (isPointInCircle) {
              return transformDashboardRental(item, searchType);
            }
          })
          .filter((item) => item !== undefined);
      }

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
        .select(`id, lng, lat, city, price, size, type, date`)
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

      let appreciationData = null;

      if (appreciateParam === "0" && Number(range) < 501) {
        const limitNumber: number =
          Number(range) / 40 < 8 ? 8 : Math.floor(Number(range) / 40);

        const { data: earliestData, error: earliestError } =
          await supabaseClient
            .from("contracts")
            .select(`id, price, size, date`)
            .eq("type", `${searchTypeMap[searchType]}`)
            .eq("for_view", true)
            .in("subtype", setSubtypeGroup(searchType))
            .gt("lat", uniq[1])
            .lt("lat", uniq[0])
            .gt("lng", uniq[3])
            .lt("lng", uniq[2])
            .limit(limitNumber)
            .order("date", { ascending: true })
            .returns<Record<string, string | number>[]>();

        if (earliestError) {
          isError = true;
          finalError = earliestError as FinalError;
        }

        appreciationData = getAppreciationData(
          earliestData!,
          data!,
          limitNumber
        );
      }

      const locationData = await fetchData(
        `https://nominatim.openstreetmap.org/search.php?q=${lat}+${lng}&format=jsonv2`
      );

      return json({
        data: generateAreaReport(
          finalData,
          extractAddress(cyrillicToLatin(locationData[0].display_name))
        ),
        list: finalData,
        rentalList: finalRentalData,
        lastDate: lastData![0].date,
        mobile: isMobile(userAgent!),
        appreciationData,
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
    rentalList: [],
    lastDate: "",
    mobile: isMobile(userAgent!),
    appreciationData: null,
  });
};

const DashboardSearch = () => {
  const defaultFilters: FiltersType = {
    range: "250",
    propertyType: "residential",
    timeRange: "3m",
  };

  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const [center, setCenter] = useState<number[]>();
  const [tab, setTab] = useState<string>("1");
  const [appreciate, setAppreciate] = useState<string>("0");
  const [rental, setRental] = useState<string>("0");
  const [appreciationData, setAppreciationData] =
    useState<AppreciationData | null>();
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);
  const [rentalData, setRentalData] = useState<DashboardSearchType[] | null>();

  const translate = new Translator("dashboard");
  const { mobile } = useLoaderData<typeof loader>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const executeScroll = () =>
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const fetcher = useFetcher<{
    data: AreaReportType;
    list: DashboardSearchType[];
    rentalList: DashboardSearchType[];
    lastDate: string;
    appreciationData: AppreciationData | null;
  }>({
    key: "search_contracts",
  });

  const { range, timeRange, propertyType } = filters;

  useEffect(() => {
    if (JSON.stringify(fetcher?.data?.list) !== undefined && mobile) {
      executeScroll();
    }
  }, [JSON.stringify(fetcher?.data?.list)]);

  useEffect(() => {
    if (appreciate === "0") {
      setAppreciationData(fetcher.data?.appreciationData);
      setAppreciate("1");
    }
  }, [JSON.stringify(fetcher?.data?.appreciationData)]);

  useEffect(() => {
    if (rental === "0") {
      setRentalData(fetcher.data?.rentalList);
      setRental("1");
    }
  }, [JSON.stringify(fetcher?.data?.rentalList)]);

  useEffect(() => {
    if (appreciate !== "0") {
      setAppreciate("0");
    }
    if (rental !== "0") {
      setRental("0");
    }

    if (center) {
      const [lat, lng] = center;
      fetcher.load(
        `/dashboard/search?lat=${lat}&lng=${lng}&city=1&range=${range}&time_range=${timeRange}&property_type=${propertyType}&appreciate=0&rental=0`
      );
    }
  }, [center]);

  useEffect(() => {
    if (appreciate !== "0") {
      setAppreciate("0");
    }

    if (propertyType !== "residential" && (tab === "5" || tab === "6")) {
      setTab("1");
    }

    if (center) {
      const [lat, lng] = center;
      fetcher.load(
        `/dashboard/search?lat=${lat}&lng=${lng}&city=1&range=${filters.range}&time_range=${filters.timeRange}&property_type=${filters.propertyType}&appreciate=0&rental=${rental}`
      );
    }

    setIsOpen(false);
  }, [filters.propertyType, filters.range, filters.timeRange]);

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

  const chipOptions = [
    {
      text: translate.getTranslation(lang, "tabReport"),
      value: "1",
      onClick: () => setTab("1"),
    },
    {
      text: translate.getTranslation(lang, "tabLine"),
      value: "2",
      onClick: () => setTab("2"),
    },
    {
      text: translate.getTranslation(lang, "tabDoughnut"),
      value: "3",
      onClick: () => setTab("3"),
    },
    {
      text: translate.getTranslation(lang, "tabDoughnutTime"),
      value: "4",
      onClick: () => setTab("4"),
    },
    {
      text: translate.getTranslation(lang, "tabLineRental"),
      value: "5",
      onClick: () => setTab("5"),
    },
    {
      text: translate.getTranslation(lang, "tabDoughnutRental"),
      value: "6",
      onClick: () => setTab("6"),
    },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <DashboardPage>
      {useMemo(() => {
        return (
          <Filters
            isOpen={isOpen}
            filters={filters}
            lang={lang}
            toggleOpen={() => setIsOpen(!isOpen)}
            submit={setFilters}
            mobile={mobile}
          />
        );
      }, [
        filters.propertyType,
        filters.range,
        filters.timeRange,
        isOpen,
        lang,
      ])}

      <div className="grid grid-cols-12 gap-4 pt-5 lg:pt-0">
        <div className="row-start-1 col-span-12 lg:col-span-7 lg:row-start-2">
          <WidgetWrapper>
            <Loader open={fetcher.state === "loading"} />
            <div className="grid grid-cols-6 grid-rows-1 gap-1 mb-4">
              <div className="col-span-5 col-start-1">
                <div className="my-0 xl:my-2 flex h-full flex-row items-center">
                  <h2 className="text-left text-md md:text-[22px] font-bold">
                    {translate.getTranslation(lang, "searchTitle")}
                  </h2>
                </div>
              </div>

              <div className="col-span-1 col-start-6">
                <div className="flex flex-row-reverse">
                  <div className="w-[30px]">
                    <LocalTooltip
                      text={translate.getTranslation(lang, "searchDescription")}
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
            </div>
            <div className="grid grid-cols-6 grid-rows-1 gap-1 mb-4">
              <div className="w-full col-span-6 col-start-1">
                <p className="font-regular text-[16px] text-left text-gray-600">
                  {fetcher?.data?.data?.address
                    ? `${translate.getTranslation(lang, "areaCenter")} ${
                        fetcher?.data?.data.address
                      }`
                    : `${translate.getTranslation(lang, "areaCenterNo")}`}
                </p>
              </div>
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

            <FiltersDisplay
              mobile={mobile}
              lang={lang}
              filters={filters}
              openFilters={() => setIsOpen(true)}
            />
          </WidgetWrapper>
        </div>
        <div
          ref={scrollRef}
          className="row-start-2 col-span-12 lg:col-span-5 h-auto xl:h-[calc(100vh-40px)] overflow-none xl:overflow-x-none xl:overflow-y-scroll col-start-1 lg:col-start-8 lg:row-start-2 mb-6 scrollbar-thin"
        >
          <div className="mb-6 xl:mb-4">
          <WidgetWrapper>
            <div className="min-h-[200px]">
              <Loader open={fetcher.state === "loading"} />
              <AppreciateReport
                range={range}
                appreciationData={appreciationData}
                lang={lang}
                type={propertyType}
                isData={Boolean(fetcher.data?.data)}
                point={Boolean(center)}
              />
            </div>
          </WidgetWrapper>
          </div>
          <WidgetWrapper>
            <Loader open={fetcher.state === "loading"} />
            <ChipsGroupItem
              data={
                propertyType === "residential"
                  ? chipOptions
                  : chipOptions.slice(0, 4)
              }
              current={tab}
              mobile={mobile}
            />
            <div className="mt-1">
              {tab === "1" && (
                <div>
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
              {tab === "5" && (
                <AreaLineReport
                  isLine={center !== undefined}
                  data={rentalData || []}
                  lang={lang}
                  timeRange="1y"
                  date={""}
                  rental
                  mobile
                />
              )}
              {tab === "6" && (
                <AreaDoughnutReport
                  isShown={center !== undefined}
                  data={rentalData || []}
                  lang={lang}
                  mobile={mobile}
                  propertyType={propertyType}
                  rental
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
