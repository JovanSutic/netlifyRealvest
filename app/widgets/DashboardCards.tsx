import { Box } from "@mui/material";
import Card from "../components/card";
import {
  CardsReport,
  LangType,
  MainReportType,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import { RangeOption } from "../utils/dateTime";
import { getCardEffects, getRangeDates, prepareCardDataForDisplay } from "../utils/reports";

const DashboardCards = ({
  mobile,
  data,
  timeRange,
  lang,
}: {
  mobile: boolean;
  data: MainReportType[];
  timeRange: RangeOption;
  lang: LangType;
}) => {
  const translator = new Translator("dashboard");
  const cardEffects = getCardEffects(data, timeRange);
  const rangeDates = getRangeDates(data, timeRange, lang);
  const cards = prepareCardDataForDisplay(cardEffects);

  const tooltipMap: Record<string, string> = {
    "cardAverageM2-3m": "boxTooltipPriceMonth",
    "cardAverageM2-6m": "boxTooltipPriceMonth",
    "cardAverageM2-1y": "boxTooltipPriceMonth",
    "cardAverageM2-3y": "boxTooltipPriceQuarter",
    "cardAverageM2-5y": "boxTooltipPriceHalf",
    "cardAverageM2-10y": "boxTooltipPriceYear",
    "cardAveragePrice-3m": "boxTooltipPriceMonth",
    "cardAveragePrice-6m": "boxTooltipPriceMonth",
    "cardAveragePrice-1y": "boxTooltipPriceMonth",
    "cardAveragePrice-3y": "boxTooltipPriceQuarter",
    "cardAveragePrice-5y": "boxTooltipPriceHalf",
    "cardAveragePrice-10y": "boxTooltipPriceYear",
    "cardAverageSize-3m": "boxTooltipSizeMonth",
    "cardAverageSize-6m": "boxTooltipSizeMonth",
    "cardAverageSize-1y": "boxTooltipSizeMonth",
    "cardAverageSize-3y": "boxTooltipSizeQuarter",
    "cardAverageSize-5y": "boxTooltipSizeHalf",
    "cardAverageSize-10y": "boxTooltipSizeYear",
  }

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          justifyContent: "space-between",
          alignSelf: "center",
          width: "100%",
          gap: mobile ? "20px" : "0px",
          mb: "20px",
        }}
      >
        {(Object.keys(cards) as unknown as Array<keyof CardsReport>)?.map(
          (item) => (
            <Card
              key={item}
              label={translator.getTranslation(lang!, cards[item].labelKey)}
              value={cards[item].value}
              tooltip={translator.getTranslation(lang!, tooltipMap[`${cards[item].labelKey}-${timeRange}`])}
              changeValue={cards[item].changeValue!}
              isMobile={mobile}
              start={cards[item].start!}
              end={cards[item].end!}
              startDate={rangeDates.start}
              endDate={rangeDates.end}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default DashboardCards;
