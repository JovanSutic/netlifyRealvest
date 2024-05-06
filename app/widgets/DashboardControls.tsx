import { Typography } from "@mui/material";
import { WidgetWrapper } from "../components/layout";
import { LangType, PropertyType } from "../types/dashboard.types";
import { RangeOption, formatDate } from "../utils/dateTime";
import { Translator } from "../data/language/translator";
import ToggleButtons from "../components/toggleButtons";
import Select from "../components/select/Select";
import { InfoTooltip } from "../components/icons";

const DashboardControls = ({
  validUntil,
  mobile,
  changeParams,
  lang,
  currentRange,
  currentType,
}: {
  validUntil: string;
  mobile: boolean;
  changeParams: (value: string, type: string) => void;
  lang: LangType;
  currentRange: RangeOption;
  currentType: PropertyType;
}) => {
  const timeRangeOptions = ["3m", "6m", "1y", "3y", "5y", "10y"];
  const translator = new Translator("dashboard");

  return (
    <WidgetWrapper>
      <div className="flex flex-col w-full lg:flex-row">
        <div className="flex flex-col w-full mb-2 items-center justify-between lg:flex-row">
          <Typography variant={mobile ? "h6" : "h5"} component="h5">
            {translator.getTranslation(lang!, "widgetTitle")}
          </Typography>
        </div>
        <div className="flex flex-col w-full items-center lg:items-end">
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
            <div className="flex gap-1">
              <Select
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
              <InfoTooltip text={translator.getTranslation(lang, "tooltipType")} direction="left" />
            </div>

            <div className="flex gap-1">
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
              <InfoTooltip text={translator.getTranslation(lang, "timeRangeType")} direction="left" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <Typography variant="body2" component="h6">
              {`${translator.getTranslation(lang!, "lastDate")} ${formatDate(
                validUntil,
                lang!
              )}`}
            </Typography>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default DashboardControls;
