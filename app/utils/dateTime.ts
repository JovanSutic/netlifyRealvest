import { LangType } from "../types/dashboard.types";

export const rangeOptions = ["3m", "6m", "1y", "3y", "5y", "10y"] as const;
export type RangeOption = (typeof rangeOptions)[number];

export const getDbDateString = (
  date: Date,
  format: LangType = "sr",
  full: boolean = true
): string => {
  if (Object.prototype.toString.call(date) !== "[object Date]") return "";
  const month =
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;

  if (format === "en")
    return full
      ? `${date.getFullYear()}-${month}-${date.getDate()}`
      : `${date.getFullYear()}-${month}`;

  return full
    ? `${date.getDate()}.${month}.${date.getFullYear()}`
    : `${month}.${date.getFullYear()}`;
};

export const formatDate = (
  date: Date | string,
  format: LangType,
  isFull: boolean = true
): string => {
  if (date instanceof Date) return getDbDateString(date, format, isFull);
  const newDate = new Date(date);

  return getDbDateString(newDate, format, isFull);
};

export const rangeMap: Record<RangeOption, number> = {
  "3m": 4,
  "6m": 7,
  "1y": 13,
  "3y": 37,
  "5y": 61,
  "10y": 121,
};

export const getDateForReport = (
  range: RangeOption | null
): Date | undefined => {
  if (range) {
    const date = new Date();
    const isLastMonthLoaded = date.getDate() > 22;

    date.setMonth(
      date.getMonth() -
        (isLastMonthLoaded ? rangeMap[range] : rangeMap[range] - 1)
    );
    date.setDate(1);

    return date;
  }

  return undefined;
};

export const dateToDateString = (date: Date): string => {
  const month =
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;

  return `${date.getFullYear()}-${month}-${date.getDate()}`;
};

export const excludeDayFromDateString = (date: string): string => {
  const isEnglish = date.includes("-");
  const divider = isEnglish ? "-" : ".";
  const split = date.split(divider);

  if (isEnglish) {
    return `${split[0]}-${split[1]}`;
  }

  return `${split[1]}.${split[2]}`;
};

export const setDateString = (date: string, language: string): string => {
  const d = new Date(date);
  const month =
    d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  if (language === "en") {
    return `${d.getFullYear()}-${month}-${d.getDate()}`;
  }
  return `${d.getDate()}.${month}.${d.getFullYear()}`;
};

export const getDayInYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now.valueOf() -
    start.valueOf() +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const getYear = (date: string): number => {
  const d = new Date(date);

  return d.getFullYear();
};

export const getMonthAndYear = (date: string): string => {
  const d = new Date(date);
  const month =
    d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;

  return `${month}.${d.getFullYear()}`;
};

export const getMonthAndYearStart = (date: string): string => {
  const d = new Date(date);
  const month = d.getMonth() < 9 ? `0${d.getMonth()}` : `${d.getMonth()}`;

  return `${month}.${d.getFullYear()}`;
};
