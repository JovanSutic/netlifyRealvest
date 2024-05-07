import { WidgetWrapper } from "../components/layout";
import Table from "../components/table/Table";
import { listMainReportData } from "../utils/reports";
import { Translator } from "../data/language/translator";
import { LangType, MainReportTableData } from "../types/dashboard.types";
import Loader from '../components/loader';

const MainTableReport = ({
  data,
  lang,
  isLoading = false,
}: {
  data: Record<string, MainReportTableData>;
  lang: LangType;
  isLoading?: boolean;
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
      <Loader open={isLoading} />
      <div className="flex flex-col items-center box-border">
        <div className="flex flex-row items-center w-full mb-4 justify-between">
          <p className="text-xl">
            {translator.getTranslation(lang!, "mainTableTitle")}
          </p>
        </div>
        <div className="flex flex-col self-start w-full">
          <Table headers={tableHeaders} data={listMainReportData(data)} />
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default MainTableReport;
