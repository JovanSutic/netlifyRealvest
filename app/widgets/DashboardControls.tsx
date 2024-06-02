import { WidgetWrapper } from "../components/layout";
import { LangType, PropertyType } from "../types/dashboard.types";
import { RangeOption, formatDate } from "../utils/dateTime";
import { Translator } from "../data/language/translator";
import ToggleButtons from "../components/toggleButtons";
import Select from "../components/select/Select";
import { InfoTooltip } from "../components/icons";

const DashboardControls = ({
  validUntil = "",
  title,
  mobile,
  changeParams,
  lang,
  currentRange,
  currentType,
}: {
  validUntil?: string;
  mobile: boolean;
  title: string;
  changeParams: (value: string, type: string) => void;
  lang: LangType;
  currentRange: RangeOption;
  currentType: PropertyType;
}) => {
  const timeRangeOptions = ["3m", "6m", "1y", "3y", "5y", "10y"];
  const translator = new Translator("report");

  return (
    <WidgetWrapper>
      <div className="flex flex-col w-full lg:flex-row">
        <div className="flex flex-col w-full mb-2 items-center justify-between lg:flex-row">
          <p className="text-2xl">{title}</p>
        </div>
        <div className="flex flex-col w-full items-center lg:items-end">
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
            <div className="flex gap-1">
              <Select
                name="propertyType"
                value={currentType!}
                isFullWidth={mobile!}
                setValue={(value) => {
                  changeParams(value, "propertyType");
                }}
                options={[
                  {
                    value: "residential",
                    text: translator.getTranslation(lang!, "residentialType"),
                  },
                  {
                    value: "commercial",
                    text: translator.getTranslation(lang!, "commercialType"),
                  },
                  {
                    value: "parking",
                    text: translator.getTranslation(lang!, "parkingType"),
                  },
                ]}
              />
              <InfoTooltip
                text={translator.getTranslation(lang, "tooltipType")}
                direction="left"
              />
            </div>

            <div className="flex gap-1 items-center">
              <ToggleButtons
                value={currentRange!}
                onChange={(value) => {
                  changeParams(value, "timeRange");
                }}
                options={timeRangeOptions.map((item) => ({
                  value: item,
                  text: translator.getTranslation(lang!, item),
                }))}
              />
              <InfoTooltip
                text={translator.getTranslation(lang, "timeRangeType")}
                direction="left"
              />
            </div>
          </div>
          {validUntil && (
            <div className="flex flex-col mt-2">
              <p className="text-sm">
                {`${translator.getTranslation(lang!, "lastDate")} ${formatDate(
                  validUntil,
                  lang!
                )}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default DashboardControls;
