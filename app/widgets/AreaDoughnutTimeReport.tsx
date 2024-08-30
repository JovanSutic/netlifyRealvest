import {
  DashboardSearchType,
  LangType,
  PieChartData,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import DoughnutChart from "../components/doughnutChart";
import { numbersToPercentage } from "../utils/reports";
import { getDataForAreaTimePie } from "../utils/dashboard";
import { RangeOption } from "../utils/dateTime";
import Tooltip from "../components/tooltip/Tooltip";

const AreaDoughnutTimeReport = ({
  lang,
  isShown,
  data,
  date,
  timeRange,
  mobile = false,
}: {
  lang: LangType;
  isShown: boolean;
  data: DashboardSearchType[];
  date: string;
  timeRange: RangeOption;
  mobile?: boolean;
}) => {
  const reportTranslate = new Translator("report");
  const translate = new Translator("dashboard");

  const chartData: PieChartData = getDataForAreaTimePie(
    data,
    date,
    timeRange,
    lang
  );

  const isEmpty = isShown && data.length === 0;
  return (
    <div>
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
        {isShown && !isEmpty && (
          <div className="w-full">
            <div className="w-full flex flex-row-reverse">
              <div className="w-[30px]">
                <Tooltip
                  text={translate.getTranslation(lang, "infoReport")}
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
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-row w-full">
              <DoughnutChart
                ratio={mobile ? 1.5 : 2}
                id="areaSalesCountDistribution"
                labels={chartData.labels}
                data={numbersToPercentage(chartData.data)}
                label={reportTranslate.getTranslation(lang!, "pieUnitLabel")}
                mobile={mobile}
              />
            </div>
            {mobile && (
              <div className="flex flex-row w-full mt-4">
                <p className="w-full text-center text-sm text-gray-700">
                  {translate.getTranslation(lang, "mobileDoughnutInfo")}
                </p>
              </div>
            )}
          </div>
        )}
        {!isShown && !isEmpty && (
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

export default AreaDoughnutTimeReport;
