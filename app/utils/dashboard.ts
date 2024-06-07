import {
  AreaReportType,
  DashboardSearchType,
  DistributionTypeKey,
  LangType,
  LineChartPreparedData,
  LineDataset,
  PropertyType,
} from "../types/dashboard.types";
import {
  RangeOption,
  dateToDateString,
  formatDate,
  getDateForReport,
  rangeMap,
} from "./dateTime";
import { getAverageOfList } from "./numbers";
import { dividerMap, getListAverage } from "./reports";

export const generateAreaReport = (
  data: DashboardSearchType[],
  address: string
): AreaReportType | null => {
  if (data.length === 0) {
    return null;
  }
  const prices: number[] = [];
  const sizes: number[] = [];
  const m2Prices: number[] = [];
  let lowestPrice: number = 100000000000;
  let highestPrice: number = -1;
  let lowestM2Price: number = 100000000000;
  let highestM2Price: number = -1;

  data.forEach((item: DashboardSearchType) => {
    const m2 = Number(item.price) / Number(item.size);
    prices.push(Number(item.price));
    sizes.push(Number(item.size));
    m2Prices.push(m2);
    if (Number(item.price) < lowestPrice) lowestPrice = Number(item.price);
    if (Number(item.price) > highestPrice) highestPrice = Number(item.price);
    if (m2 < lowestM2Price) lowestM2Price = m2;
    if (m2 > highestM2Price) highestM2Price = m2;
  });
  return {
    address,
    averagePrice: getListAverage(prices, prices.length),
    averageM2Price: getListAverage(m2Prices, m2Prices.length),
    averageSize: getListAverage(sizes, sizes.length),
    highestPrice,
    highestM2Price,
    lowestPrice,
    lowestM2Price,
    count: data.length,
  };
};

export const setSubtypeGroup = (type: PropertyType): string[] => {
  const subtypeMap: Record<PropertyType, string[]> = {
    residential: ["House apartment", "Building apartment", "House whole"],
    parking: ["Parking internal"],
    commercial: ["Commercial space"],
  };
  return subtypeMap[type];
};

export async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else {
      console.log("unresolved call!!!");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const cyrillicToLatin = (word: string): string => {
  if (typeof word !== "string") return "";
  const map: Record<string, string> = {
    џ: "dž",
    Џ: "Dž",
    љ: "lj",
    Љ: "Lj",
    њ: "nj",
    Њ: "Nj",
    ђ: "đ",
    ћ: "ć",
    Ђ: "Đ",
    Ћ: "Ć",
    И: "I",
    Ц: "C",
    У: "U",
    К: "K",
    Е: "E",
    Н: "N",
    Г: "G",
    Ш: "Š",
    З: "Z",
    Х: "H",
    и: "i",
    ц: "c",
    у: "u",
    к: "k",
    е: "e",
    н: "n",
    г: "g",
    ш: "š",
    з: "z",
    х: "h",
    Ф: "F",
    В: "V",
    А: "A",
    П: "P",
    Р: "R",
    О: "O",
    Л: "L",
    Д: "D",
    Ж: "Ž",
    ф: "f",
    в: "v",
    а: "a",
    п: "p",
    р: "r",
    о: "o",
    л: "l",
    д: "d",
    ж: "ž",
    Ч: "Č",
    С: "S",
    М: "M",
    Т: "T",
    Б: "B",
    ч: "č",
    с: "s",
    м: "m",
    т: "t",
    б: "b",
  };
  return word
    .split("")
    .map(function (char) {
      return map[char as string] || char;
    })
    .join("");
};

const setReportMonths = (start: Date, timeRange: RangeOption): string[] => {
  const result: string[] = [];
  const duration = rangeMap[timeRange] - 1;

  if (duration < 13) {
    for (let index = 0; index < duration; index++) {
      let dateString = "";
      if (index === 0) {
        dateString = dateToDateString(start);
      } else {
        const nextDate = new Date(result[result.length - 1]);
        nextDate.setMonth(nextDate.getMonth() + 1);
        dateString = dateToDateString(nextDate);
      }

      result.push(dateString);
    }
  } else {
    let limit = 0;
    let lastMonth = start;
    while (duration > limit) {
      const nextMonth = new Date(lastMonth);
      nextMonth.setMonth(nextMonth.getMonth() + dividerMap[timeRange]);
      result.push(
        `${dateToDateString(lastMonth)}:${dateToDateString(nextMonth)}`
      );
      lastMonth = nextMonth;
      limit = limit + dividerMap[timeRange];
    }
  }

  return result;
};

const calculateLineData = (
  data: DashboardSearchType[],
  timeRange: RangeOption,
  type: DistributionTypeKey,
  lang: LangType
): LineChartPreparedData => {
  const preResult: Record<string, number[]> = {};
  const result: Record<string, number> = {};
  const startDate = getDateForReport(timeRange);
  const months = setReportMonths(startDate!, timeRange);

  if (rangeMap[timeRange] < 14) {
    months.forEach((month) => {
      preResult[month] = [];
    });

    data.forEach((item) => {
      const key = Object.keys(preResult).find(
        (key) => key.split("-")[1] === item.date.split("-")[1]
      )!;
      if (preResult[key]) {
        preResult[key].push(
          type === "price_map"
            ? Number(item.price)
            : Number(item.price) / Number(item.size)
        );
      }
    });

    Object.keys(preResult).forEach((key) => {
      result[formatDate(key, lang, false)] = preResult[key].length
        ? getAverageOfList(preResult[key])
        : 0;
    });
  } else {
    let limit: number = 0;
    months.forEach((month) => {
      preResult[month] = [];
    });

    data.forEach((item) => {
      const itemDate = new Date(item.date);
      const currentKey = Object.keys(preResult)[limit];

      const startDate = new Date(currentKey.split(":")[0]);
      const endDate = new Date(currentKey.split(":")[1]);

      if (itemDate >= startDate && itemDate < endDate) {
        preResult[currentKey].push(
          type === "price_map"
            ? Number(item.price)
            : Number(item.price) / Number(item.size)
        );
      } else {
        limit = limit + 1;
        const nextKey = Object.keys(preResult)[limit];
        if (preResult[nextKey]) {
          preResult[nextKey].push(
            type === "price_map"
              ? Number(item.price)
              : Number(item.price) / Number(item.size)
          );
        }
      }
    });

    Object.keys(preResult).forEach((key) => {
      const start = key.split(":")[0];
      result[formatDate(start, lang, false)] = preResult[key].length
        ? getAverageOfList(preResult[key])
        : 0;
    });
  }

  return {
    labels: Object.keys(result),
    data: Object.values(result),
  };
};

export const getAreaLineData = (
  data: DashboardSearchType[],
  label: string,
  timeRange: RangeOption,
  type: DistributionTypeKey,
  lang: LangType = "sr"
): LineDataset => {
  const dataSet = {
    labels: calculateLineData(data, timeRange, type, lang).labels,
    datasets: [
      {
        label: label,
        data: calculateLineData(data, timeRange, type, lang).data,
        fill: true,
        backgroundColor: "rgba(165, 180, 252, 0.6)",
        borderColor: "rgb(99 102 241)",
      },
    ],
  };

  return dataSet;
};
