import { Details, ListedAd } from "./dashboard.types";

export interface Profitability {
  id?: number;
  average_competition: number;
  median_competition: number;
  competition_new_build_count: number;
  competition_new_build_average: number;
  min_competition: number;
  max_competition: number;
  competition_count: number;
  city_count_sold: number;
  city_average: number;
  competition_trend: number;
  average_rental: number;
  min_rental: number;
  max_rental: number;
  rental_count: number;
  ad_id: number;
  ad_type: string;
}

export interface PhotoItem {
  id?: number;
  link: string;
  apartment_id: number;
}
export interface MarketIndexItem {
  id: number;
  is_photo: boolean;
  city_part: string;
  date_signed: Date | string;
  size: number;
  room_number: number;
  price: number;
  photo?: PhotoItem;
  average_price: number;
  is_details: boolean;
  detail_id: number;
  detail_type: string;
  detail_ad_id: number;
  detail_lng: number;
  detail_lat: number;
  detail_listed: true,
  profitability_id: number;
  profitability_competition_trend: number;
  profitability_rental_count: number;
  profitability_average_competition: number;
  profitability_ad_id: number;
}

export interface MarketItem {
  id: number;
  city_part: string;
  date_signed: Date | string;
  size: number;
  room_number: number;
  price: number;
  details: Partial<Details>;
  profitability: Partial<Profitability>;
  photo?: PhotoItem;
}



export interface AverageReport {
  difference: number;
  percent: number;
  isUnderPriced: boolean;
}

export interface MarketItemHighlight {
    type: string;
    value: number;
}

export interface PropertyHighlights {
  averageReport: AverageReport;
  yearRental: number;
  demandRatio: number;
  trend: number;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface PropertyPurchaseExpenses {
  tax: number;
  agency: number;
  legal: number;
  total: number;
}

export type MarketSingleType =  ListedAd & {
  details: Details;
  photos: PhotoItem[];
  profit: Profitability;
}

export interface FeatureItem {
  name: string;
  isTrue: boolean;
}