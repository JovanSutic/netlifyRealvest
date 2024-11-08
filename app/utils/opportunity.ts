import {
  ListedAd,
  OpportunityListItem,
  RenovationType,
  RentalAverage,
} from "../types/dashboard.types";
import {
  getNumberWithDecimals,
  isNewFromDesc,
  isForRenovation,
  isForHalfRenovation,
} from "./market";

export const truncateString = (str: string, maxLength: number = 40): string => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
};

export const calculateNotaryFee = (price: number): number => {
  return getNumberWithDecimals(price * 0.0033, 2);
};

export const calculateAbsoluteTax = (price: number): number => {
  return getNumberWithDecimals(price * 0.025, 2);
};

export const calculateExtraTax = (price: number): number => {
  return getNumberWithDecimals(price * 0.1, 2);
};

export const calculateAgentFee = (price: number): number => {
  return getNumberWithDecimals(price * 0.03, 2);
};

export const getFullPrice = (price: number, description: string): number => {
  const isNew = isNewFromDesc(description);
  const tax = isNew ? calculateExtraTax(price) : calculateAbsoluteTax(price);
  return (
    price + tax + 40 + calculateNotaryFee(price) + calculateAgentFee(price)
  );
};

export const getRenovationType = (description: string): RenovationType => {
    let isRenovation: RenovationType = "no";
    if (isForHalfRenovation(description)) isRenovation = "half";
    if (isForRenovation(description) && !isForHalfRenovation(description))
      isRenovation = "full";

    return isRenovation;
}

export const getFurnitureCost = (
  size: number,
  needsRenovation: RenovationType
): number => {
  let m2Expense = 300;
  if (needsRenovation === "half") m2Expense = 550;
  if (needsRenovation === "full") m2Expense = 750;
  return getNumberWithDecimals(size * m2Expense, 2);
};

export const getPurchaseFee = (
  price: number,
  description: string,
  size: number
): number => {
  const renovationType = getRenovationType(description);
  return (
    (getFullPrice(price, description) + getFurnitureCost(size, renovationType)) *
    0.02
  );
};

export const getM2Price = (
  price: number,
  description: string,
  size: number
): number => {
  const  renovationType = getRenovationType(description);
  const fullPrice =
    getFullPrice(price, description) + getFurnitureCost(size, renovationType);
  return getNumberWithDecimals((fullPrice + fullPrice * 0.03) / size, 2);
};

export const getRentGross = (rent: number, size: number) => {
  return getNumberWithDecimals(rent * size * 1.2, 2);
};

export const getRentTax = (rent: number, size: number) => {
  const gross = getRentGross(rent, size);
  return getNumberWithDecimals((gross - gross * 0.2) * 0.2, 2);
};

export const getRentNet = (rent: number, size: number) => {
  return getRentGross(rent, size) - getRentTax(rent, size);
};

export const getRentFee = (rent: number, size: number) => {
  return getNumberWithDecimals(getRentNet(rent, size) * 0.08, 2);
};

export const getRentAmortization = (rent: number, size: number) => {
  return getNumberWithDecimals(getRentNet(rent, size) * 0.15, 2);
};

export const getRentRevenue = (rent: number, size: number) => {
  return (
    getRentNet(rent, size) -
    getRentFee(rent, size) -
    getRentAmortization(rent, size)
  );
};

export const getRentRevenueM2 = (rent: number, size: number) => {
  return getNumberWithDecimals(getRentRevenue(rent, size) / size, 2);
};

export const getRentRevenueM2Yearly = (rent: number, size: number) => {
  return getRentRevenueM2(rent, size) * 12;
};

export const getRentROI = (
  rent: number,
  price: number,
  description: string,
  size: number
) => {
  return getNumberWithDecimals(
    (getRentRevenueM2Yearly(rent, size) /
      getM2Price(price, description, size)) *
      100,
    2
  );
};

export const highlightRoi = (
  rent: number,
  price: number,
  description: string,
  size: number
): string => {
  const roi = getRentROI(rent, price, description, size);

  if (roi > 5) return "bg-green-100";
  if (roi > 4) return "bg-blue-100";
  if (roi > 3) return "bg-amber-100";

  return "bg-white";
};

export const highlightPriceM2 = (
  price: number,
  description: string,
  size: number
): string => {
  const m2Price = getM2Price(price, description, size);
  if (m2Price <= 3000) return "bg-green-100";
  if (m2Price <= 4000) return "bg-blue-100";
  if (m2Price <= 5000) return "bg-amber-100";

  return "bg-white";
};

export const highlightRentGross = (rent: number, size: number): string => {
  const gross = getRentGross(rent, size);
  if (gross <= 500) return "bg-green-100";
  if (gross <= 700) return "bg-blue-100";
  if (gross <= 1000) return "bg-amber-100";

  return "bg-white";
};

export const getLocationRentalPrice = (
  rentals: ListedAd[],
  size: number
): RentalAverage => {
  let pairSize: number = 0;
  let pairPrice: number = 0;
  let allSize: number = 0;
  let allPrice: number = 0;

  rentals.forEach((item) => {
    allPrice = allPrice + item.price;
    allSize = allSize + item.size;

    const sizeDiff = (Math.abs(size - item.size) / size) * 100;

    if (sizeDiff < 15) {
      pairSize = pairSize + item.size;
      pairPrice = pairPrice + item.price;
    }
  });

  return {
    pairAverage: pairPrice / pairSize,
    allAverage: allPrice / allSize,
  };
};

export const normalizeUrlString = (str: string): string => {
  return str
    .replace(/ž/g, "z")
    .replace(/č|ć/g, "c")
    .replace(/š/g, "s")
    .replace(/đ/g, "dj")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/\s/g, "-");
};

export const sortOpportunity = (
  opportunities: OpportunityListItem[],
  field: keyof OpportunityListItem,
  descending: boolean = false
): OpportunityListItem[] => {
  return [...opportunities].sort((a, b) => {
    let selectorA = a[field];
    let selectorB = b[field];

    if (field === "price") {
      selectorA = getM2Price(a.price, a.description, a.size);
      selectorB = getM2Price(b.price, b.description, b.size);
    }

    if (field === "rent_ratio") {
      selectorA = getRentROI(a.average_rental, a.price, a.description, a.size);
      selectorB = getRentROI(b.average_rental, b.price, b.description, b.size);
    }

    if (selectorA < selectorB) {
      return descending ? 1 : -1;
    } else if (selectorA > selectorB) {
      return descending ? -1 : 1;
    } else {
      return 0;
    }
  });
};
