import {
  DashboardParams,
  PropertyType,
  propertyType,
} from "../types/dashboard.types";
import { RangeOption, rangeOptions } from "./dateTime";
import { isNumber } from "./numbers";

export const getParamValue = (
  search: string,
  param: string,
  alter: string = ""
): string => {
  const paramItem = search
    .split("?")[1]
    .split("&")
    .find((item: string) => item.split("=")[0] === param);

  if (paramItem) {
    return paramItem.split("=")[1];
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

export const isMobile = (userAgent: string) => {
  if (
    userAgent.match(/Mobi/i) ||
    userAgent.match(/Android/i) ||
    userAgent.match(/iPhone/i)
  ) {
    return true;
  }

  return false;
};
