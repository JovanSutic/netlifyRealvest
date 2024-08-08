import {
  DashboardSearchType,
  DistributionTypeKey,
  LangType,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import { Line } from "react-chartjs-2";
import { getAreaLineData, isZeroPeriodValues } from "../utils/dashboard";
import ToggleButtons from "../components/toggleButtons";
import { RangeOption } from "../utils/dateTime";
import { useEffect, useState } from "react";
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
} from "chart.js";
import { makeNumberCurrency } from "../utils/numbers";

const AreaLineReport = ({
  lang,
  isLine,
  data,
  timeRange,
  date = "",
  rental = false,
}: {
  lang: LangType;
  isLine: boolean;
  data: DashboardSearchType[];
  timeRange: RangeOption;
  date: string;
  rental?: boolean;
}) => {
  const [distributionType, setDistributionType] =
    useState<DistributionTypeKey>("price_map");
  const reportTranslate = new Translator("report");
  const translate = new Translator("dashboard");

  const isEmpty = isLine && data.length === 0;

  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
  }, []);

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-700 font-serif">
          {data.length > 0 &&
            translate.getTranslation(
              lang,
              rental ? "areaLineDescriptionRental" : "areaLineDescription"
            )}
        </p>
      </div>
      <div>
        {isEmpty && (
          <div>
            <div className="flex flex-column w-full justify-center h-[200px]">
              <p className="flex items-center text-center text-slate-400 font-sm">
                {translate.getTranslation(
                  lang,
                  rental ? "areaEmptyDataRental" : "areaEmptyData"
                )}
              </p>
            </div>
          </div>
        )}
        {isLine && !isEmpty && (
          <>
            <div className="flex flex-row-reverse mb-4">
              <ToggleButtons
                value={distributionType!}
                onChange={(value) => {
                  setDistributionType(value as DistributionTypeKey);
                }}
                options={[
                  {
                    value: "average_price_map" as DistributionTypeKey,
                    text: reportTranslate.getTranslation(lang!, "pieToggleM2"),
                  },
                  {
                    value: "price_map" as DistributionTypeKey,
                    text: reportTranslate.getTranslation(lang!, "pieToggle"),
                  },
                ]}
              />
            </div>
            <Line
              data={getAreaLineData(
                data || [],
                reportTranslate.getTranslation(
                  lang!,
                  distributionType === "price_map"
                    ? "averagePrice"
                    : `averageM2`
                ),
                timeRange,
                distributionType,
                lang,
                date
              )}
              options={{
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      callback: function (value: number) {
                        return `${makeNumberCurrency(value)}`;
                      },
                    },
                  },
                },
                plugins: {
                  legend: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    onClick: (e) => e.stopPropagation(),
                  },
                  tooltip: {
                    displayColors: false,
                    callbacks: {
                      label: function (context) {
                        return `${context.formattedValue}€`;
                      },
                    },
                  },
                },
              }}
            />
            {isZeroPeriodValues(
              data || [],
              timeRange,
              distributionType,
              date
            ) && (
              <div className="mt-3">
                <p className="text-red-500 flex flex-row-reverse text-[12px]">
                  {translate.getTranslation(
                    lang,
                    rental ? "zeroRental" : "zeroSales"
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </p>
              </div>
            )}
          </>
        )}
        {!isLine && !isEmpty && (
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
  );
};

export default AreaLineReport;
