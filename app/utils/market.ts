import { LangType } from "../types/dashboard.types";
import { AverageReport, MarketItem, PropertyPurchaseExpenses } from "../types/market.types";

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

export const getAverageReport = (property: MarketItem): AverageReport => {
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

export const getYearRental = (property: MarketItem) => {
  return property.profitability.averageRental
    ? property.size * property.profitability.averageRental * 12
    : 0;
};

export const getPropertyDemand = (property: MarketItem): string => {
  const { profitability } = property;
  const demandRatio =
    profitability.competitionCount && profitability.cityCountSold
      ? (1 - profitability.competitionCount / profitability.cityCountSold) * 10
      : 0;

  return `${getNumberWithDecimals(demandRatio, 2)}`;
};



const calculateLegalExpenses = (price: number): number => {
  if (price < 50001) return 300;
  if (price < 100001) return 350;
  if (price < 150001) return 500;
  if (price < 200001) return 700;
  if (price < 250001) return 800;
  if (price < 300001) return 900;
  if (price < 400001) return 1000;
  if (price < 500001) return 1200;

  return 1500;
};
export const getPropertyPurchaseExpenses = (price: number): PropertyPurchaseExpenses => {
  return {
    tax: price * 0.025,
    agency: price * 0.02,
    legal: calculateLegalExpenses(price),
    total: price * 0.045 + calculateLegalExpenses(price),
  };
};
