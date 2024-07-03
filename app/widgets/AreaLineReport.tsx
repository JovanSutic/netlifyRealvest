import {
  DashboardSearchType,
  DistributionTypeKey,
  LangType,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import { Line } from "react-chartjs-2";
import { getAreaLineData } from "../utils/dashboard";
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

const AreaLineReport = ({
  lang,
  isLine,
  data,
  timeRange,
  date = "",
}: {
  lang: LangType;
  isLine: boolean;
  data: DashboardSearchType[];
  timeRange: RangeOption;
  date: string;
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
        <p className="text-sm text-slate-700">
          {translate.getTranslation(lang, "areaLineDescription")}
        </p>
      </div>
      <div>
        {isEmpty && (
          <div>
            <div className="flex flex-column w-full justify-center h-[200px]">
              <p className="flex items-center text-center text-slate-400 font-sm">
                {translate.getTranslation(lang, "areaEmptyData")}
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
