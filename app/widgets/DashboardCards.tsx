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
  isLoading = false,
}: {
  mobile: boolean;
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
              changeValue={cards[item].changeValue!}
              isMobile={mobile}
              start={cards[item].start!}
              end={cards[item].end!}
              startDate={rangeDates.start}
              endDate={rangeDates.end}
              isLoading={isLoading}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default DashboardCards;
