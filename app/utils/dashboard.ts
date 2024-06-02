import {
  AreaReportType,
  DashboardSearchType,
  PropertyType,
} from "../types/dashboard.types";
import { getListAverage } from "./reports";

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
