import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Column, Line, Page } from "../components/layout";
import MainTableReport from "../widgets/MainTableReport";
import { json } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import {useLoaderData, useSearchParams } from "@remix-run/react";
import {
  RangeOption,
  getDateForReport,
  getDbDateString,
} from "../utils/dateTime";
import { getDataForMainReport, getOptions } from "../utils/reports";
import PieReport from "../widgets/PieReport";
import { isDashboardParamsValid, isMobile } from "../utils/params";
import { MainReportType, PieReportType } from "../types/dashboard.types";
import DashboardControls from "../widgets/DashboardControls";
import DashboardCards from "../widgets/DashboardCards";
import { default as ErrorPage } from "../components/error";
import { Translator } from "../data/language/translator";

const mandatorySearchParams: Record<string, string> = {
  lang: "sr",
  time_range: "3m",
  property_type: "residential",
  municipality: "1",
  distribution_type: "price_map",
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const searchType = new URL(request.url).searchParams.get("property_type");
  const searchRange = new URL(request.url).searchParams.get("time_range");
  const searchMunicipality = new URL(request.url).searchParams.get(
    "municipality"
  );

  const startDate = getDateForReport(
    (searchRange || mandatorySearchParams.timeRange) as RangeOption
  );

  const supabase = createClient(
    process.env.SUPABASE_URL_LOCAL!,
    process.env.SUPABASE_KEY_LOCAL!
  );

  const { data: mainReports, error: mainError } = await supabase
    .from("contract_report")
    .select(
      `id, count, sum_price, average_meter_price, min_average, sum_size, max_average, date_to, municipality(
    id, name
  )`
    )
    .eq("type", `${searchType || mandatorySearchParams.propertyType}`)
    .gt("date_from", getDbDateString(startDate!, "en"))
    .returns<MainReportType[]>();
  if (mainError) {
    console.log(mainError);
  }

  const { data: pieReports, error: pieError } = await supabase
    .from("pie_contract_report")
    .select(
      `id, price_map, average_price_map, date_to, municipality(
    id, name
  )`
    )
    .eq("type", `${searchType || mandatorySearchParams.propertyType}`)
    .eq(
      "municipality",
      `${searchMunicipality || mandatorySearchParams.municipality}`
    )
    .gt("date_from", getDbDateString(startDate!, "en"));

  if (pieError) {
    console.log(pieError);
  }

  const { data: municipalities, error: municipalitiesError } = await supabase
    .from("municipalities")
    .select();

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

  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const timeRange = searchParams.get("time_range");
  const propertyType = searchParams.get("property_type");
  const municipality = searchParams.get("municipality");
  const distributionType = searchParams.get("distribution_type");
  const translator = new Translator("dashboard");

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

  if (
    !isDashboardParamsValid({
      lang,
      timeRange,
      propertyType,
      municipality,
      distributionType,
    })
  ) {
    return (
      <ErrorPage
        title={translator.getTranslation(lang!, "dashboardErrorTitle")}
        subtitle={translator.getTranslation(lang!, "dashboardErrorSubtitle")}
        buttonText={translator.getTranslation(lang!, "dashboardErrorButton")}
        link={`/dashboard/?lang=${mandatorySearchParams.lang}&time_range=${mandatorySearchParams.time_range}&property_type=${mandatorySearchParams.property_type}&municipality=${mandatorySearchParams.municipality}&distribution_type=${mandatorySearchParams.distribution_type}`}
      />
    );
  }

  return (
    <Page mobile={mobile}>
      <Line mobile={mobile}>
        <Column size={5}>
          <DashboardControls
            validUntil={reports[reports.length - 1].date_to}
            mobile={mobile}
          />
        </Column>
      </Line>
      <Line mobile={mobile}>
        <Column size={mobile ? 5 : 3}>
          <DashboardCards mobile={mobile} data={reports} />
          <MainTableReport data={getDataForMainReport(reports)} mobile={mobile} />
        </Column>
        <Column size={mobile ? 5 : 2}>
          <PieReport
            municipalityList={getOptions(municipalities)}
            lineData={reports.filter(
              (item) => item.municipality.id === Number(municipality)
            )}
            data={pieReportData}
            mobile={mobile}
          />
        </Column>
      </Line>
    </Page>
  );
}

export function ErrorBoundary() {

  return <ErrorPage link={"/"} />;
}
