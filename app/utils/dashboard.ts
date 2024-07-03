import {
  AreaReportType,
  DashboardSearchType,
  DistributionTypeKey,
  LangType,
  LineChartPreparedData,
  LineDataset,
  PieChartData,
  PropertyType,
} from "../types/dashboard.types";
import {
  RangeOption,
  dateToDateString,
  excludeDayFromDateString,
  formatDate,
  getDateForReport,
  getLastRecordedReportDate,
  rangeMap,
} from "./dateTime";
import { getAverageOfList, makeNumberCurrency } from "./numbers";
import { dividerMap, getListAverage, getPieSpread } from "./reports";

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

  if (duration < 14) {
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
    while (duration + 1 > limit) {
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
  lang: LangType,
  date: string = ""
): LineChartPreparedData => {
  const preResult: Record<string, number[]> = {};
  const result: Record<string, number> = {};
  const startDate = date
    ? getLastRecordedReportDate(timeRange, date)
    : getDateForReport(timeRange);
  const months = setReportMonths(startDate!, timeRange);

  if (rangeMap[timeRange] < 14) {
    months.forEach((month) => {
      preResult[month] = [];
    });

    data.forEach((item) => {
      const key = Object.keys(preResult).find(
        (key) => key?.split("-")?.[1] === item?.date?.split("-")?.[1]
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

      const startDate = new Date(currentKey?.split(":")[0]);
      const endDate = new Date(currentKey?.split(":")[1]);

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
  lang: LangType = "sr",
  date: string = ""
): LineDataset => {
  const dataSet = {
    labels: calculateLineData(data, timeRange, type, lang, date).labels,
    datasets: [
      {
        label: label,
        data: calculateLineData(data, timeRange, type, lang, date).data,
        fill: true,
        backgroundColor: "rgba(165, 180, 252, 0.6)",
        borderColor: "rgb(99 102 241)",
      },
    ],
  };

  return dataSet;
};

export const getDataForAreaPie = (
  list: DashboardSearchType[],
  distributionType: DistributionTypeKey,
  propertyType: PropertyType
): PieChartData => {
  const total: number[] = [];
  list?.forEach((item) =>
    total.push(
      distributionType === "price_map"
        ? Number(item.price)
        : Number(item.price) / Number(item.size)
    )
  );
  total.sort((a: number, b: number) => a - b);
  const spread = getPieSpread(distributionType, propertyType === "parking");
  const result: Record<string, number[]> = {};
  for (let index = 0; index < spread.length; index++) {
    const element = spread[index];
    const previousElement = index === 0 ? 0 : spread[index - 1];
    const equal = total.filter(
      (item) => item <= element && item > previousElement
    );
    if (equal.length) {
      result[
        `${makeNumberCurrency(previousElement)} - ${makeNumberCurrency(
          element
        )}`
      ] = equal;
    }
  }

  return {
    labels: Object.keys(result),
    data: Object.keys(result).map((key) => result[key].length),
  };
};

export const getDataForAreaTimePie = (
  list: DashboardSearchType[],
  date: string = "",
  timeRange: RangeOption,
  lang: LangType,
): PieChartData => {
  if (list.length) {
    const longLabels: string[] = [];
    const longData: number[] = [];
    const labels: string[] = [];
    const dataPreset: Record<string, number[]> = {};
    const newDate = new Date(date);

    for (let index = 0; index < rangeMap[timeRange] - 1; index++) {
      newDate.setMonth(newDate?.getMonth() - 1);
      const labelItem = excludeDayFromDateString(dateToDateString(newDate));
      labels.push(labelItem);
      dataPreset[labelItem] = [];
    }

    list.forEach((item) => {
      if (dataPreset[`${item.date?.split("-")[0]}-${item.date?.split("-")[1]}`]) {
        dataPreset[
          `${item.date?.split("-")[0]}-${item.date?.split("-")[1]}`
        ].push(item.price);
      }
    });

    if (labels.length > 12) {
      const num = labels.length / dividerMap[timeRange];
      for (let index = 0; index < num; index++) {
        const base = index * dividerMap[timeRange];
        longLabels.push(
          `${formatDate(labels[base + (dividerMap[timeRange] - 1)], lang, false)} - ${formatDate(labels[base], lang, false)}`
        );
        const particleKeys = Object.keys(dataPreset).slice(
          base,
          base + dividerMap[timeRange]
        );
        const particle = particleKeys
          .map((key) => dataPreset[key].length)
          .reduce((a: number, b: number) => a + b, 0);
        longData.push(particle);
      }
    }

    return {
      labels:
        labels.length > 12
          ? longLabels
              .map((item, index) => `${item}: ${longData[index]}`)
              .reverse()
          : labels
              .map(
                (item, index) =>
                  `${formatDate(item, lang, false)}: ${
                    dataPreset[Object.keys(dataPreset)[index]].length
                  }`
              )
              .reverse(),
      data:
        labels.length > 12
          ? longData.reverse()
          : Object.keys(dataPreset)
              .map((key) => dataPreset[key].length)
              .reverse(),
    };
  }

  return {
    labels: [],
    data: [],
  };
};