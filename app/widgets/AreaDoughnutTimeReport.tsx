import {
  DashboardSearchType,
  LangType,
  PieChartData,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import DoughnutChart from "../components/doughnutChart";
import { numbersToPercentage } from "../utils/reports";
import {getDataForAreaTimePie } from "../utils/dashboard";
import { RangeOption } from "../utils/dateTime";

const AreaDoughnutTimeReport = ({
  lang,
  isShown,
  data,
  date,
  timeRange
}: {
  lang: LangType;
  isShown: boolean;
  data: DashboardSearchType[];
  date: string;
  timeRange: RangeOption;
}) => {
  const reportTranslate = new Translator("report");
  const translate = new Translator("dashboard");

  const chartData: PieChartData = getDataForAreaTimePie(data, date, timeRange, lang);

  const isEmpty = isShown && data.length === 0;
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-700 font-serif">
          {data.length > 0 && translate.getTranslation(lang, "areaDoughnutTimeDescription")}
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
        {isShown && !isEmpty && (
          <>
            <div className="flex flex-row w-full">
              <DoughnutChart
                ratio={1.5}
                id="areaSalesCountDistribution"
                labels={chartData.labels}
                data={numbersToPercentage(chartData.data)}
                label={reportTranslate.getTranslation(lang!, "pieUnitLabel")}
              />
            </div>
          </>
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
