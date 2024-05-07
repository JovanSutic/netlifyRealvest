import { WidgetWrapper } from "../components/layout";
import Select from "../components/select/Select";
import {
  getDataForPie,
  getSingleLineDataset,
  numbersToPercentage,
} from "../utils/reports";
import ToggleButtons from "../components/toggleButtons";
import DoughnutChart from "../components/doughnutChart";
import { Line } from "react-chartjs-2";
import EmptyChart from "../components/emptyChart";
import { Translator } from "../data/language/translator";
import {
  DistributionTypeKey,
  LangType,
  MainReportType,
  PieChartData,
  PieReportType,
  PropertyType,
} from "../types/dashboard.types";
import { DropdownOptions } from "../types/component.types";
import { RangeOption } from "../utils/dateTime";
import Divider from "../components/divider";

const PieReport = ({
  municipalityList,
  lineData,
  data,
  mobile,
  changeParams,
  lang,
  distributionType,
  propertyType,
  timeRange,
  municipality,
}: {
  municipalityList: DropdownOptions[];
  lineData: MainReportType[];
  data: PieReportType[];
  mobile: boolean;
  changeParams: (value: string, type: string) => void;
  lang: LangType;
  distributionType: DistributionTypeKey;
  propertyType: PropertyType;
  timeRange: RangeOption;
  municipality: string;
}) => {
  const translator = new Translator("dashboard");
  const chartData: PieChartData = getDataForPie(
    data,
    distributionType,
    propertyType!
  );

  return (
    <WidgetWrapper>
      <div className="flex flex-col w-full box-border items-center">
        <div className="flex flex-col w-full">
          <div className="flex flex-row w-full mb-4 items-center justify-between">
            <p className="text-xl">
              {translator.getTranslation(lang!, "pieTitle")}
            </p>
            <Select
              value={municipality}
              setValue={(value) => {
                changeParams(value, "municipality");
              }}
              options={municipalityList || []}
            />
          </div>
          <Divider />
        </div>

        <div className="flex flex-col w-full mt-5">
          <Line
            data={getSingleLineDataset(
              lineData,
              translator.getTranslation(lang!, `priceAverage3m`),
              timeRange,
              lang
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
        </div>
        <div className="flex flex-col w-full self-start my-7">
          <Divider />
          <div className="flex flex-row w-full mt-6 mb-5 items-center justify-end">
            <ToggleButtons
              value={distributionType!}
              onChange={(value) => {
                changeParams(value, "distributionType");
              }}
              options={[
                {
                  value: "average_price_map",
                  text: translator.getTranslation(lang!, "pieToggleM2"),
                },
                {
                  value: "price_map",
                  text: translator.getTranslation(lang!, "pieToggle"),
                },
              ]}
            />
          </div>
          {chartData.labels.length ? (
            <>
              <div className="flex flex-row w-full">
                <DoughnutChart
                  ratio={mobile ? 1.5 : 2}
                  id="salesDistribution"
                  labels={chartData.labels}
                  data={numbersToPercentage(chartData.data)}
                  label={
                    distributionType === "price_map"
                      ? translator.getTranslation(lang!, "pieUnitLabel")
                      : translator.getTranslation(lang!, "pieAverageLabel")
                  }
                />
              </div>
            </>
          ) : (
            <EmptyChart
              title={translator.getTranslation(lang!, "pieEmptyTitle")}
              subtitle={translator.getTranslation(lang!, "pieEmptySubtitle")}
            />
          )}
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default PieReport;
