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
  import ToggleButtons from "../components/toggleButtons";
  import { useState } from "react";
import { numbersToPercentage } from "../utils/reports";
import { getDataForAreaPie } from "../utils/dashboard";

const AreaDoughnutReport = ({
    lang,
    isShown,
    data,
    propertyType,
    rental = false,
  }: {
    lang: LangType;
    isShown: boolean;
    data: DashboardSearchType[];
    propertyType: PropertyType | RentalPropertyType;
    rental?: boolean;
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
    return(
        <div>
      <div className="mb-4">
        <p className="text-sm text-slate-700">
          {translate.getTranslation(lang, "areaDoughnutDescription")}
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
    )
}

export default AreaDoughnutReport;