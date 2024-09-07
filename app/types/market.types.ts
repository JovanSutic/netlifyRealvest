import { Details } from "./dashboard.types";

export interface Profitability {
  id?: number;
  averageCompetition: number;
  medianCompetition: number;
  competitionNewBuildCount: number;
  competitionNewBuildAverage: number;
  minCompetition: number;
  maxCompetition: number;
  competitionCount: number;
  cityCountSold: number;
  cityAverage: number;
  competitionTrend: number;
  averageRental: number;
  minRental: number;
  maxRental: number;
  rentalCount: number;
  ad_id: number;
  ad_type: string;
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
