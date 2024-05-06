import Card from "../components/card";
import {
  CardsReport,
  LangType,
  MainReportType,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import { RangeOption } from "../utils/dateTime";
import {
  getCardEffects,
  getRangeDates,
  prepareCardDataForDisplay,
} from "../utils/reports";

const DashboardCards = ({
  data,
  timeRange,
  lang,
  isLoading = false,
}: {
  data: MainReportType[];
  timeRange: RangeOption;
  lang: LangType;
  isLoading?: boolean;
}) => {
  const translator = new Translator("dashboard");
  const cardEffects = getCardEffects(data, timeRange);
  const rangeDates = getRangeDates(data, timeRange, lang);
  const cards = prepareCardDataForDisplay(cardEffects);

  return (
    <div className="relative">
      <div className="flex flex-col justify-between self-center w-full gap-5 mb-5 lg:flex-row lg:gap-0">
        <div className="grid grid-cols-12 gap-4">
          {(Object.keys(cards) as unknown as Array<keyof CardsReport>)?.map(
            (item) => (
              <Card
                key={item}
                label={translator.getTranslation(lang!, cards[item].labelKey)}
                value={cards[item].value}
                changeValue={cards[item].changeValue!}
                start={cards[item].start!}
                end={cards[item].end!}
                startDate={rangeDates.start}
                endDate={rangeDates.end}
                isLoading={isLoading}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
