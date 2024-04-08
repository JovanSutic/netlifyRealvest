import { Box } from "@mui/material";
import Card from "../components/card";
import { CardsReport, LangType, MainReportType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import { useSearchParams } from "@remix-run/react";
import { RangeOption } from "../utils/dateTime";
import { getCardEffects, prepareCardDataForDisplay } from "../utils/reports";

const DashboardCards = ({ mobile, data }: { mobile: boolean; data: MainReportType[];}) => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") as LangType;
  const timeRange = searchParams.get("time_range") as RangeOption;
  const translator = new Translator("dashboard");
  const cardEffects = getCardEffects(data, timeRange); 
  const cards = prepareCardDataForDisplay(cardEffects);

  return (
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
          />
        )
      )}
    </Box>
  );
};

export default DashboardCards;
