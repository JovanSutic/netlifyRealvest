import { RangeOption } from "../utils/dateTime";

export type GeneralObject = { id: number; name: string };
export const rentalPropertyType = [
  "rental",
  "garage_rental",
  "commercial_rental",
] as const;
export type RentalPropertyType = (typeof rentalPropertyType)[number];
export const propertyType = ["residential", "parking", "commercial"] as const;
export type PropertyType = (typeof propertyType)[number];

export const roles = [
  "admin",
  "guest",
  "premium",
  "basic",
  "agency",
  "limitedPremium",
] as const;
export type RoleType = (typeof roles)[number];

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

export interface ConnectionDetails {
  id: number;
  lat: number;
  lng: number;
  description: string;
  type: string;
  distance?: number;
}

export interface MapItem {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
  geojson: { type: string; coordinates: number[][] };
}

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
  municipality?: string;
  date: string;
  city: string;
  price: number;
  size: number;
  type: string;
  description?: string;
}

export interface FeatureReportData {
  essentials: Record<string, number>[];
  benefits: Record<string, number>[];
}

export interface Features {
  furnished: number;
  interfon: number;
  camera: number;
  security: number;
  lift: number;
  terrace: number;
  reception: number;
  parking: number;
  centralHeating: number;
  cableTv: number;
  internet: number;
  pets: number;
  aircon: number;
  lux?: number;
  phone?: number;
}

export interface DashboardRentalType {
  city: string;
  city_part: string;
  date_created: string;
  id: number;
  link_id: {
    lat: number;
    lng: number;
    description: string;
    furnished: boolean;
  };
  name: string;
  price: number;
  size: number;
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

export type ListedAd = {
  id?: number;
  name: string;
  link: string;
  size: number;
  price: number;
  city?: string;
  city_part: string;
  source_id: string;
  room_number?: number;
  room_ratio?: number;
  is_agency?: boolean;
  average_price?: number;
  date_signed: Date;
  date_updated?: Date;
  date_created?: Date;
  is_details?: boolean;
  comm_type?: string;
};

const listedAds = [
  "apartment",
  "rental",
  "garage",
  "garage_rental",
  "commercial",
  "commercial_rental",
] as const;
export type ListedAdType = (typeof listedAds)[number];

export enum ParkingType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}
export enum ParkingEntrance {
  GROUND = "ground",
  PLATFORM = "platform",
}

export type Details = {
  id?: number;
  type?: ListedAdType;
  ad_id?: number;
  lng: number;
  lat: number;
  floor: number;
  additional?: string;
  technical?: string;
  security?: string;
  rest?: string;
  floor_limit?: number;
  built_year?: number;
  listed?: boolean;
  built_state?: string;
  furnished?: boolean;
  lift?: boolean;
  terrace?: boolean;
  cellar?: boolean;
  intercom?: boolean;
  heating?: string;
  parking?: boolean;
  parking_type?: ParkingType;
  parking_level?: number;
  parking_entrance?: ParkingEntrance;
  parking_ownership?: boolean;
  rooms?: number;
  baths?: number;
  pets?: boolean;
  inner_state?: string;
  description?: string;
};

export interface AppreciationData {
  lastAverage: number;
  appreciationRate: number;
  fiveYearPrice: number;
  fiveYearPercent: number;
  tenYearPrice: number;
  tenYearPercent: number;
  years: number;
}

export interface RentEstimationData {
  average: number;
  count: number;
  expense: number;
}

export interface FiltersType {
  timeRange: RangeOption;
  range: string;
  propertyType: PropertyType;
  sizeFrom: string;
  sizeTo: string;
  priceFrom: string;
  priceTo: string;
}

export interface OpportunityListItem {
  id: number;
  name: string;
  link: string;
  date_created: Date | string;
  size: number;
  price: number;
  city_part: string;
  average_rental: number;
  rental_count: number;
  competition_trend: number;
  floor: number;
  floor_limit: number;
  lat: number;
  lng: number;
  description: string;
  rent_ratio: number;
  price_ratio: number;
}

export interface RentalAverage {
  pairAverage: number;
  allAverage: number;
}

export type RenovationType = "no" | "half" | "full";

export interface OpportunityType {
  id?: number;
  apartment_id: number;
  lat: number;
  lng: number;
  discount: number;
  renovation: string;
  new_rent: number;
  is_qualified: boolean;
  date_created: Date;
  date_qualified?: Date | null;
  coordinatesChange?: boolean;
}
