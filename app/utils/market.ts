import { LangType } from "../types/dashboard.types";
import {
  AverageReport,
  MarketItem,
  MarketItemHighlight,
} from "../types/market.types";
import { makeNumberCurrency } from "./numbers";

export const switchLanguage = (path: string, newLang: LangType): string => {
  const oldLang = newLang === "sr" ? "en" : "sr";
  if (path.includes("lang=")) {
    return path.replace(`lang=${oldLang}`, `lang=${newLang}`);
  }
  if (path.includes("?")) {
    return `${path}&lang=${newLang}`;
  }

  return `${path}?lang=${newLang}`;
};

export const getNumberWithDecimals = (num: number, decimal: number) => {
  const map = [1, 10, 100, 1000, 10000, 100000];
  return Number(
    (Math.round(num * map[decimal]) / map[decimal]).toFixed(decimal)
  );
};

const getAverageReport = (property: MarketItem): AverageReport => {
  const averageDiff =
    (property.profitability.averageCompetition || 0) -
    property.price / property.size;
  return {
    difference: averageDiff,
    percent:
      averageDiff > 0
        ? averageDiff / property.profitability.averageCompetition!
        : 0,
    isUnderPriced: averageDiff > 0,
  };
};

const getYearRental = (property: MarketItem) => {
  return property.profitability.averageRental
    ? property.size * property.profitability.averageRental * 12
    : 0;
};

export const getPropertyHighlight = (
  property: MarketItem
): MarketItemHighlight => {
  const { profitability } = property;
  const averageReport = getAverageReport(property);
  const yearRental = getYearRental(property);
  const demandRatio =
    profitability.competitionCount && profitability.cityCountSold
      ? (profitability.competitionCount / profitability.cityCountSold) * 100
      : 0;

  if (averageReport.isUnderPriced) {
    return { type: "underpriced", value: averageReport.percent };
  }

  if (demandRatio < 0.1) {
    return { type: "demand", value: demandRatio };
  }

  if (yearRental > 0) {
    return { type: "rental", value: yearRental };
  }

  return { type: "trend", value: profitability.competitionTrend! * 100 };
};

export const formatHighLightValue = (
  highlight: MarketItemHighlight
): string => {
  if (highlight.type === "rental") return makeNumberCurrency(highlight.value);
  if (highlight.type === "trend" || highlight.type === "underpriced")
    return `${getNumberWithDecimals(highlight.value, 2)}%`;

  return `${getNumberWithDecimals(highlight.value, 2)}`;
};
