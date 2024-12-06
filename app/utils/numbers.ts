import { LayoutClass } from "../types/component.types";

export const isNumber = (value: string | number): boolean => {
  if (typeof value === "number") return true;
  if (typeof value === "string" && !value.length) return false;
  if (typeof value !== "string" && typeof value !== "number") return false;

  return !Number.isNaN(Number(value.replace(",", ".")));
};

export const makeNumberCurrency = (
  num: number,
  currency: string = "€",
  fraction: number = 0
) => {
  return `${(num || 0).toLocaleString(undefined, {
    maximumFractionDigits: fraction,
  })}${currency}`;
};

export const roundNumberToDecimal = (
  num: number,
  decimalPlace: number
): number => {
  if (!isNumber(num) || !isNumber(decimalPlace)) return 0;
  return Number((Math.round(num * 100) / 100).toFixed(decimalPlace));
};

export const createLayoutClasses = (
  limit: number,
  type: LayoutClass
): Record<number, string> => {
  const classMap: Record<LayoutClass, string> = {
    grid: "grid-cols-",
    gap: "gap-",
    span: "col-span-",
    start: "col-start-",
  };

  const result: Record<number, string> = {};
  let index = 1;
  while (limit >= index) {
    result[index] = `${classMap[type]}${index}`;
    index = index + 1;
  }

  return result;
};

export const getAverageOfList = (data: number[]): number => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i];
  }
  return total / data.length;
};

export const makeNumberPercent = (num: number): string => {
  return `${roundNumberToDecimal(num * 100, 2)}%`;
};

export const getNotaryFee = (price: number): number => {
  const additionFee = 10;
  const additionLimit = 8550;
  const limits = [5000, 21000, 42000, 60000, 85000, 120000];
  const fees = [62, 105, 140, 200, 240, 280];

  if (price > limits[limits.length - 1]) {
    const addition =
      Math.ceil((price - limits[limits.length - 1]) / additionLimit) *
      additionFee;
    return limits[limits.length - 1] + addition;
  }

  const index = limits.findIndex((item) => price < item);

  return fees[index];
};
