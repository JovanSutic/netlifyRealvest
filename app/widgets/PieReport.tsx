import { Box, Divider, Typography } from "@mui/material";
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
import Loader from "~/components/loader";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
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
              {translator.getTranslation(lang!, "pieTitle")}
            </Typography>
            <Select
              value={municipality}
              setValue={(value) => {
                changeParams(value, "municipality");
              }}
              options={municipalityList || []}
            />
          </Box>
          <Divider />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "20px",
          }}
        >
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
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
            width: "100%",
            marginTop: "28px",
            marginBottom: "28px",
          }}
        >
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "center",
              width: "100%",
              marginTop: "24px",
              marginBottom: "20px",
            }}
          >
            <ToggleButtons
              value={distributionType!}
              size="small"
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
          </Box>
          {chartData.labels.length ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
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
              </Box>
            </>
          ) : (
            <EmptyChart
              height={208}
              title={translator.getTranslation(lang!, "pieEmptyTitle")}
              subtitle={translator.getTranslation(lang!, "pieEmptySubtitle")}
            />
          )}
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default PieReport;
