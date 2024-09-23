import { differenceInDays } from "date-fns";
import { Details, LangType, RoleType } from "../types/dashboard.types";
import {
  AverageReport,
  FeatureItem,
  MarketItem,
  MarketSortType,
  PropertyPurchaseExpenses,
  SortParams,
  UserRole,
} from "../types/market.types";

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
    (property.profitability.average_competition || 0) -
    property.price / property.size;
  return {
    difference: averageDiff,
    percent:
      averageDiff > 0
        ? averageDiff / property.profitability.average_competition!
        : 0,
    isUnderPriced: averageDiff > 0,
  };
};

export const getYearRental = (property: MarketItem) => {
  return property.profitability.average_rental
    ? property.size * property.profitability.average_rental * 12
    : 0;
};

export const getPropertyDemand = (property: MarketItem): string => {
  const { profitability } = property;
  const demandRatio =
    profitability.competition_count && profitability.city_count_sold
      ? (1 - profitability.competition_count / profitability.city_count_sold) *
        10
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

const catchIndicators = (text: string, indicators: string[]) => {
  let result = false;

  for (let index = 0; index < indicators.length; index++) {
    const indicator = indicators[index];
    const find = text.toLowerCase().search(indicator);
    if (find > -1) {
      result = true;
      break;
    }
  }
  return result;
};

export const getPropertyPurchaseExpenses = (
  price: number,
  detail?: Details
): PropertyPurchaseExpenses => {
  const withoutTax = catchIndicators(detail?.description || "", [
    "bez pdv",
    "se dodaje pdv",
  ]);
  const tax = withoutTax ? price * 0.1 : price * 0.025;
  const agency = price * 0.02;

  return {
    tax,
    agency,
    legal: calculateLegalExpenses(price),
    total: agency + tax + calculateLegalExpenses(price),
  };
};

export const isNewBuild = (detail: Details) => {
  if (
    catchIndicators(detail.description || "", [
      "lux",
      "nov stan",
      "u novoizgradjenom kompleksu",
      "u novogradnji",
      "u izgradnji",
    ]) ||
    catchIndicators(detail.built_state || "", [
      "lux",
      "novogradnja",
      "u izgradnji",
    ]) ||
    new Date().getFullYear() - (detail.built_year || 0) < 10
  )
    return true;

  return false;
};

const isRenovation = (detail: Details) => {
  return catchIndicators(detail.description || "", [
    "lux",
    "renoviran",
    "renovirano",
    "extra sređen",
  ]);
};

export const getRenovationExpenses = (detail: Details) => {
  const standardM2 = 450;
  const yearDiff = new Date().getFullYear() - (detail.built_year || 0);

  if (isNewBuild(detail)) return 0;
  if (yearDiff < 4 && detail.built_state === "Novogradnja") return 0;
  if (
    catchIndicators(detail.description || "", [
      "renovirano kupatilo",
      "renovirano je kupatilo",
    ])
  ) {
    return standardM2 * 0.8;
  }
  if (
    catchIndicators(detail.description || "", [
      "lux",
      "renoviran",
      "renovirano",
      "nov stan",
      "u novoizgradjenom kompleksu",
      "u izgradnji",
      "extra sređen",
    ]) ||
    detail.built_state === "Lux"
  )
    return 0;

  if (detail.built_year) {
    return yearDiff < 15 ? yearDiff * (standardM2 / 15) : standardM2;
  }

  return standardM2;
};

const getParkingPoints = (detail: Details): number => {
  if (
    detail.parking_type === null &&
    catchIndicators(detail.description || "", [
      "cena garažnog mesta",
      "parking mesto",
      "garažno mesto",
    ])
  ) {
    return 10;
  }

  let result = 0;
  if (detail.parking) result = result + 5;
  if (detail.parking_type === "internal") result = result + 5;
  if (detail.parking_entrance === "ground") result = result + 2;

  return result;
};

const isTerrace = (detail: Details) => {
  return (
    detail.terrace ||
    catchIndicators(detail.description || "", [
      "terasa",
      "terase",
      "terasi",
      "terasu",
      "balkon",
      "lođa",
      "lodja",
      "lođe",
      "lodje",
      "lodji",
      "lođi",
      "balkonu",
    ])
  );
};

const isGoodHeating = (detail: Details) => {
  return (
    catchIndicators(detail.heating || "", ["centralno", "podno", "etažno"]) ||
    catchIndicators(detail.description || "", [
      "centralno grejanje",
      "podno grejanje",
      "podnog grejanja",
      "etažno grejanje",
      "grejanje - etažno",
      "toplotne pumpe",
      "toplotnih pumpi",
      "centralnog grejanja",
    ])
  );
};

export const getFlipProbability = (detail: Details, roomRatio: number) => {
  let result = 40;
  if (!(detail.floor < 1 || detail.floor === detail.floor_limit))
    result = result + 10;
  if (isNewBuild(detail)) result = result + 15;
  if (detail.lift) result = result + 5;
  if (detail.intercom) result = result + 3;
  if (detail.cellar) result = result + 2;
  if (isTerrace(detail)) result = result + 5;
  if (isGoodHeating(detail)) result = result + 5;
  if (roomRatio > 0.05) result = result + 2;
  result = result + getParkingPoints(detail);

  return result < 65 ? 0.65 : result / 100;
};

const isAdditionalLux = (detail: Details) => {
  return (
    catchIndicators(detail.additional || "", [
      "bazen",
      "recepcija",
      "sauna",
      "spa ",
      "spa zona",
      "spa centar",
      "teretana",
    ]) ||
    catchIndicators(detail.description || "", [
      "bazen",
      "recepcija",
      "sauna",
      "spa ",
      "spa zona",
      "spa centar",
      "teretana",
    ])
  );
};

const isAdditionalSecurity = (detail: Details) => {
  return (
    catchIndicators(detail.security || "", [
      "alarm",
      "kamera",
      "obezbeđenje",
    ]) ||
    catchIndicators(detail.description || "", [
      "alarm",
      "kamera",
      "obezbeđenje",
    ])
  );
};

const isWithView = (detail: Details) => {
  return catchIndicators(detail.description || "", [
    "sa pogledom",
    "pogled na",
    "pogled",
  ]);
};

export const getMarketFeatures = (detail: Details): FeatureItem[] => {
  const result = [
    { name: "featTerrace", isTrue: isTerrace(detail) },
    { name: "featNew", isTrue: isNewBuild(detail) },
    { name: "featHeat", isTrue: isGoodHeating(detail) },
    { name: "featParking", isTrue: getParkingPoints(detail) > 0 },
    { name: "featRenovation", isTrue: isRenovation(detail) },
    { name: "featFurnished", isTrue: Boolean(detail.furnished) },
    { name: "featView", isTrue: isWithView(detail) },
    { name: "featLift", isTrue: Boolean(detail.lift) },
    { name: "featCellar", isTrue: Boolean(detail.cellar) },
    { name: "featInter", isTrue: Boolean(detail.intercom) },
    { name: "featCable", isTrue: Boolean(detail.rest?.search("Kablovska")) },
    {
      name: "featSecurity",
      isTrue: isAdditionalSecurity(detail),
    },
    {
      name: "featLux",
      isTrue: isAdditionalLux(detail),
    },
  ];

  return result;
};

export const getSortingParams = (param: MarketSortType): SortParams => {
  if (param === "date_asc") return { column: "date_signed", order: "ASC" };
  if (param === "date_desc") return { column: "date_signed", order: "DESC" };
  if (param === "price_asc") return { column: "price", order: "ASC" };
  if (param === "price_desc") return { column: "price", order: "DESC" };
  if (param === "size_asc") return { column: "size", order: "ASC" };
  if (param === "size_desc") return { column: "size", order: "DESC" };

  return { column: "date_signed", order: "ASC" };
};

export const isRoleForUpdate = (role: UserRole): boolean => {
  const today = new Date();
  if (role.role === "premium") return false;
  if (role.date === null) return true;
  if (differenceInDays(today, role.date) > 0) return true;
  if (role.count < 5) return true;

  return false;
};

export const getRoleForUpsert = (role: UserRole): UserRole => {
  const today = new Date();
  const count = role.count === null ? 1 : role.count + 1;
  return { ...role, date: today, count };
};

export const getSessionUserRole = (role: UserRole): RoleType => {
  const today = new Date();
  if(role.role === 'basic') {
    if(role.date !== null) {
      if(differenceInDays(today, role.date) > 0 || role.count < 5) {
        return 'limitedPremium'
      }
    } else {
      console.log('alo')
      return 'limitedPremium'
    }
  }

  return role.role;
}