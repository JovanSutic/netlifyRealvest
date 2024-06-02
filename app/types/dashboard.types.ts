import { RangeOption } from "../utils/dateTime";

export type GeneralObject = { id: number; name: string };
export const propertyType = ["residential", "parking", "commercial"] as const;
export type PropertyType = (typeof propertyType)[number];

export type PieReportType = {
  id: number;
  price_map: number[];
  average_price_map: number[];
  municipality: {
    id: number;
    name: string;
  };
};

export type PieChartData = { labels: string[]; data: number[] };

export type LangType = "en" | "sr";

export type DistributionTypeKey = "price_map" | "average_price_map";

export type MainReportType = {
  id: number;
  count: number;
  sum_price: number;
  average_meter_price: number;
  max_average: number;
  sum_size: number;
  date_to: string;
  municipality: {
    id: number;
    name: string;
  };
};

export type MainReportTableData = {
  municipality?: string;
  count: number;
  averageM2: number;
  averageSize: number;
  averagePrice: number;
};

export type MainReportTableCalculation = {
  municipality?: string;
  count: number;
  averageM2: number[];
  averageSize: number[];
  averagePrice: number[];
};

export type DashboardParams = {
  lang: string | null;
  timeRange: string | null;
  propertyType: string | null;
  municipality: string | null;
  distributionType: string | null;
};

export type LineDataset = {
  labels: (string | undefined)[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
  }[];
};

export type LineChartPreparedData = {
  labels: string[];
  data: number[];
};

export type CardsReportCalculation = {
  averageM2: number[];
  averagePrice: number[];
  averageSize: number[];
  count: number[];
};

export type CardReportItem = {
  labelKey: string;
  value: string;
  changeType?: "minus" | "zero" | "plus";
  changeValue?: number;
  start?: string;
  end?: string;
};

export type CardsReport = {
  averageM2: CardReportItem;
  averagePrice: CardReportItem;
  averageSize: CardReportItem;
};

export type CardsDataCalculation = {
  count: number;
  sum_price: number;
  average_meter_price: number[];
  sum_size: number;
};

export type CardsDataInfo = {
  count: number;
  sum_price: number;
  average_meter_price: number;
  sum_size: number;
};

type CardsDataItem = {
  value: number;
  difference: number;
  start?: number;
  end?: number;
};

export type CardsData = {
  sum_price: CardsDataItem;
  average_meter_price: CardsDataItem;
  sum_size: CardsDataItem;
};

export type DashboardParamsUI = {
  lang: LangType;
  time_range: RangeOption;
  property_type: PropertyType;
  municipality: string;
  distribution_type: DistributionTypeKey;
};

export interface DashboardSearchType {
  id: number;
  lng: number; 
  lat: number; 
  municipality: string;
  city: string;
  price: number; 
  size: number;
  type: string;
}

export interface AreaReportType {
  address: string;
  averagePrice: number;
  averageM2Price: number;
  averageSize: number;
  highestPrice: number;
  highestM2Price: number;
  lowestPrice: number;
  lowestM2Price: number;
  count: number;
}
