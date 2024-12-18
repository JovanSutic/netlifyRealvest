import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import MainTableReport from "../widgets/MainTableReport";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useSearchParams,
  useFetcher,
  Link,
} from "@remix-run/react";
import {
  RangeOption,
  getDateForReport,
  getDbDateString,
} from "../utils/dateTime";
import { getDataForMainReport, getOptions } from "../utils/reports";
import PieReport from "../widgets/PieReport";
import { isMobile } from "../utils/params";
import {
  DashboardParamsUI,
  DistributionTypeKey,
  LangType,
  MainReportType,
  PieReportType,
  PropertyType,
} from "../types/dashboard.types";
import DashboardControls from "../widgets/DashboardControls";
import DashboardCards from "../widgets/DashboardCards";
import { useState, useMemo, useCallback, useEffect } from "react";
import Loader from "../components/loader";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";

const mandatorySearchParams: DashboardParamsUI = {
  lang: "sr",
  time_range: "6m",
  property_type: "residential",
  municipality: "1",
  distribution_type: "price_map",
};

export const meta: MetaFunction = () => {
  return [
    { title: "Realvest dashboard" },
    { name: "description", content: "Welcome to Realvest dashboard" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  try {
    const {data: userData} = await supabaseClient.auth.getUser();
    if (userData.user && userData.user?.role !== "authenticated") {
      return redirect("/auth");
    }
  } catch (error) {
    console.log(error);
  }

  const userAgent = request.headers.get("user-agent");
  const searchType = new URL(request.url).searchParams.get("property_type");
  const searchRange = new URL(request.url).searchParams.get("time_range");
  const searchMunicipality = new URL(request.url).searchParams.get(
    "municipality"
  );

  const startDate = getDateForReport(
    (searchRange || mandatorySearchParams.time_range) as RangeOption
  );

  try {
    const { data: mainReports, error: mainError } = await supabaseClient
      .from("contract_report")
      .select(
        `id, count, sum_price, average_meter_price, min_average, sum_size, max_average, date_to, municipality(
    id, name
  )`
      )
      .eq("type", `${searchType || mandatorySearchParams.property_type}`)
      .gt("date_from", getDbDateString(startDate!, "en"))
      .returns<MainReportType[]>();
    if (mainError) {
      console.log(mainError);
    }

    const { data: pieReports, error: pieError } = await supabaseClient
      .from("pie_contract_report")
      .select(
        `id, price_map, average_price_map, date_to, municipality(
    id, name
  )`
      )
      .eq("type", `${searchType || mandatorySearchParams.property_type}`)
      .eq(
        "municipality",
        `${searchMunicipality || mandatorySearchParams.municipality}`
      )
      .gt("date_from", getDbDateString(startDate!, "en"));

    if (pieError) {
      console.log(pieError);
    }

    const { data: municipalities, error: municipalitiesError } =
      await supabaseClient.from("municipalities").select();

    if (municipalitiesError) {
      console.log(municipalitiesError);
    }

    if (mainReports?.length) {
      return json({
        mobile: isMobile(userAgent!),
        reports: mainReports,
        pieReportData: pieReports || [],
        municipalities: municipalities || [],
      });
    }
  } catch (error) {
    console.log(error);
  }

  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export default function Index() {
  const [timeRange, setTimeRange] = useState(mandatorySearchParams.time_range);
  const [propertyType, setPropertyType] = useState<PropertyType>(
    mandatorySearchParams.property_type
  );
  const [municipality, setMunicipality] = useState(
    mandatorySearchParams.municipality
  );
  const [distributionType, setDistributionType] = useState(
    mandatorySearchParams.distribution_type
  );
  const [paramChangeType, setParamChangeType] = useState<"all" | "part">("all");

  const changeSearchParam = useCallback(
    (value: string, type: string) => {
      if (type === "propertyType") {
        if (paramChangeType === "part") {
          setParamChangeType("all");
        }
        setPropertyType(value as PropertyType);
      }
      if (type === "timeRange") {
        if (paramChangeType === "part") {
          setParamChangeType("all");
        }
        setTimeRange(value as RangeOption);
      }
      if (type === "distributionType") {
        if (paramChangeType !== "part") {
          setParamChangeType("part");
        }
        setDistributionType(value as DistributionTypeKey);
      }
      if (type === "municipality") {
        if (paramChangeType !== "part") {
          setParamChangeType("part");
        }
        setMunicipality(value);
      }
    },
    [paramChangeType]
  );

  const [searchParams] = useSearchParams();
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const fetcher = useFetcher<{
    reports: MainReportType[];
    mobile: boolean;
    municipalities: { id: number; name: string }[];
    pieReportData: PieReportType[];
  }>({ key: "report_change" });

  const {
    reports,
    mobile,
    municipalities,
    pieReportData,
  }: {
    reports: MainReportType[];
    mobile: boolean;
    municipalities: { id: number; name: string }[];
    pieReportData: PieReportType[];
  } = useLoaderData();

  useEffect(() => {
    fetcher.load(
      `/report/?time_range=${timeRange}&property_type=${propertyType}&municipality=${municipality}&distribution_type=${distributionType}`
    );
  }, [timeRange, propertyType, municipality, distributionType]);

  const translator = new Translator("report");

  return (
    <TPage mobile={mobile}>
      <TLine columns={1}>
        <TColumn span={1}>
          <div className="text-center mb-2 underline">
            <Link
              to={lang === "en" ? "/dashboard/?lang=sr" : "/dashboard/?lang=en"}
              reloadDocument
            >
              {lang === "en" ? "srpska verzija" : "english version"}
            </Link>
          </div>
          <DashboardControls
            title={translator.getTranslation(lang!, "widgetTitle")}
            validUntil={reports[reports.length - 1].date_to}
            changeParams={changeSearchParam}
            mobile={mobile}
            lang={lang}
            currentRange={timeRange}
            currentType={propertyType}
          />
        </TColumn>
      </TLine>
      <TLine columns={mobile ? 1 : 10} gap={4}>
        <TColumn span={mobile ? 10 : 6} start={1}>
          {useMemo(
            () => (
              <>
                <DashboardCards
                  lang={lang}
                  data={fetcher.data?.reports || reports}
                  timeRange={timeRange}
                  isLoading={
                    fetcher.state === "loading" && paramChangeType === "all"
                  }
                />
                <MainTableReport
                  data={getDataForMainReport(fetcher.data?.reports || reports)}
                  lang={lang}
                  isLoading={
                    fetcher.state === "loading" && paramChangeType === "all"
                  }
                />
              </>
            ),
            [
              JSON.stringify(fetcher.data?.reports),
              reports.length,
              fetcher.state,
              paramChangeType,
            ]
          )}
        </TColumn>
        <TColumn span={mobile ? 10 : 4} start={mobile ? 1 : 7}>
          <Loader open={fetcher.state === "loading"} />
          {useMemo(() => {
            return (
              <PieReport
                municipalityList={getOptions(municipalities)}
                lineData={(fetcher.data?.reports || reports).filter(
                  (item) => item.municipality.id === Number(municipality)
                )}
                data={fetcher.data?.pieReportData || pieReportData}
                mobile={mobile}
                changeParams={changeSearchParam}
                lang={lang}
                distributionType={distributionType}
                propertyType={propertyType}
                timeRange={timeRange}
                municipality={municipality}
              />
            );
          }, [
            JSON.stringify(fetcher.data?.reports),
            JSON.stringify(fetcher.data?.pieReportData),
            municipality,
            reports.length,
            distributionType,
          ])}
        </TColumn>
      </TLine>
    </TPage>
  );
}
