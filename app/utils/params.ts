import {
  DashboardParams,
  PropertyType,
  propertyType,
} from "../types/dashboard.types";
import { RangeOption, rangeOptions } from "./dateTime";
import { isNumber } from "./numbers";
import { UAParser } from "ua-parser-js";

export const getParamValue = (
  search: string,
  param: string,
  alter: string = ""
): string => {
  const paramItem = search
    ?.split("?")[1]
    ?.split("&")
    ?.find((item: string) => item.split("=")[0] === param);

  if (paramItem) {
    return paramItem?.split("=")[1];
  }

  return alter;
};
const isValidLangParam = (lang: string | null): boolean =>
  lang === "sr" || lang === "en";
const isValidMunicipalityParam = (municipality: string | null): boolean =>
  municipality === null ? false : isNumber(municipality);
const isValidTimeRange = (timeRange: string | null): boolean =>
  rangeOptions.includes(timeRange as RangeOption);
const isValidPropertyType = (type: string | null): boolean =>
  propertyType.includes(type as PropertyType);
const isValidDistributionType = (type: string | null): boolean =>
  type === "price_map" || type === "average_price_map";

export const isDashboardParamsValid = (params: DashboardParams): boolean => {
  if (
    isValidLangParam(params.lang) &&
    isValidMunicipalityParam(params.municipality) &&
    isValidTimeRange(params.timeRange) &&
    isValidPropertyType(params.propertyType) &&
    isValidDistributionType(params.distributionType)
  )
    return true;
  return false;
};

export const detectDevice = (userAgent: string): string => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  return device.type || "desktop";
};

export const isMobile = (userAgent: string) => {
  if (
    userAgent?.match(/Mobi/i) ||
    userAgent?.match(/Android/i) ||
    userAgent?.match(/iPhone/i)
  ) {
    return true;
  }

  return false;
};

export const sizeOptions = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200, 250, 300, 400,
  500, 1000,
];
export const priceOptions = [
  0, 5000, 10000, 20000, 40000, 60000, 80000, 100000, 150000, 200000, 250000,
  300000, 350000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000,
  1500000, 3000000,
];

export const m2PriceOptions = [
  0, 1000, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 600000, 7000, 10000, 15000,
];
