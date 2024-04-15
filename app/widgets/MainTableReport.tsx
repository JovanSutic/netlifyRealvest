import { Box, Typography } from "@mui/material";
import { WidgetWrapper } from "../components/layout";
import Table from "../components/table/Table";
import { listMainReportData } from "../utils/reports";
import { Translator } from "../data/language/translator";
import { LangType, MainReportTableData } from "../types/dashboard.types";

const MainTableReport = ({
  data,
  mobile,
  lang,
}: {
  data: Record<string, MainReportTableData>;
  mobile: boolean;
  lang: LangType;
}) => {
  const translator = new Translator("dashboard");
  const tableHeaders = [
    {
      key: "municipality",
      name: translator.getTranslation(lang!, "municipality"),
    },
    {
      key: "count",
      name: translator.getTranslation(lang!, "count"),
      sortable: true,
    },
    {
      key: "averageM2",
      name: translator.getTranslation(lang!, "averageM2"),
      sortable: true,
      financial: true,
    },
    {
      key: "averagePrice",
      name: translator.getTranslation(lang!, "averagePrice"),
      sortable: true,
      financial: true,
    },
    {
      key: "averageSize",
      name: translator.getTranslation(lang!, "averageSize"),
      sortable: true,
      financial: false,
      size: true,
    },
  ];
  return (
    <WidgetWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "16px",
          }}
        >
          <Typography
            component="h6"
            variant={mobile ? "subtitle1" : "h6"}
            sx={{ fontWeight: "400" }}
          >
            {translator.getTranslation(lang!, "mainTableTitle")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
            width: "100%",
          }}
        >
          <Table headers={tableHeaders} data={listMainReportData(data)} />
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default MainTableReport;
