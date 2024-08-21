import {
  DashboardSearchType,
  DistributionTypeKey,
  LangType,
  PieChartData,
  PropertyType,
  RentalPropertyType,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import DoughnutChart from "../components/doughnutChart";
import ToggleButton from "../components/toggleButtons/ToggleButton";
import { useState } from "react";
import { numbersToPercentage } from "../utils/reports";
import { getDataForAreaPie } from "../utils/dashboard";
import Tooltip from "../components/tooltip/Tooltip";

const AreaDoughnutReport = ({
  lang,
  isShown,
  data,
  propertyType,
  rental = false,
  mobile = false,
}: {
  lang: LangType;
  isShown: boolean;
  data: DashboardSearchType[];
  propertyType: PropertyType | RentalPropertyType;
  rental?: boolean;
  mobile?: boolean;
}) => {
  const [distributionType, setDistributionType] =
    useState<DistributionTypeKey>("price_map");
  const reportTranslate = new Translator("report");
  const translate = new Translator("dashboard");

  const chartData: PieChartData = getDataForAreaPie(
    data,
    distributionType,
    propertyType!,
    rental
  );

  const isEmpty = isShown && data.length === 0;
  const margin: string = mobile ? "mb-8" : "mb-4";

  return (
    <div>
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
            <div className={`flex justify-center ${margin}`}>
              <ToggleButton
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

            <div className="flex flex-row w-full">
              <DoughnutChart
                ratio={2}
                id={`areaSalesDistribution-${distributionType}`}
                labels={chartData.labels}
                data={numbersToPercentage(chartData.data)}
                label={
                  distributionType === "price_map"
                    ? reportTranslate.getTranslation(lang!, "pieUnitLabel")
                    : reportTranslate.getTranslation(lang!, "pieAverageLabel")
                }
                mobile={mobile}
              />
            </div>
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

export default AreaDoughnutReport;
