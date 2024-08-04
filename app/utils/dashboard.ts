import {
  AreaReportType,
  DashboardRentalType,
  DashboardSearchType,
  Details,
  DistributionTypeKey,
  FeatureReportData,
  Features,
  LangType,
  LineChartPreparedData,
  LineDataset,
  PieChartData,
  PropertyType,
  RentalPropertyType,
} from "../types/dashboard.types";
import {
  RangeOption,
  dateToDateString,
  excludeDayFromDateString,
  formatDate,
  getDateForReport,
  getLastRecordedReportDate,
  getTimeRangeString,
  rangeMap,
} from "./dateTime";
import { getAverageOfList, makeNumberCurrency } from "./numbers";
import {
  dividerMap,
  getListAverage,
  getPieSpread,
  getPieSpreadRental,
} from "./reports";
import {
  addMonths,
  format,
  setDate,
} from "date-fns";
import { ellipse, point, lineString, bbox, bboxPolygon } from "@turf/turf";

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
  const duration = rangeMap[timeRange];

  if (duration < 14) {
    for (let index = 0; index < duration; index++) {
      const nextDate = addMonths(start, index);
      result.push(dateToDateString(nextDate));
    }
    result.shift();
  } else {
    const months = [];
    for (let index = 0; index < duration; index++) {
      const nextDate = addMonths(start, index);
      months.push(dateToDateString(nextDate));
    }
    months.shift();

    for (
      let index = 0;
      index < months.length / dividerMap[timeRange];
      index++
    ) {
      const base = index * dividerMap[timeRange];
      result.push(
        `${format(setDate(months[base], 1), "yyyy-MM-dd")}:${
          months[base + (dividerMap[timeRange] - 1)]
        }`
      );
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
      const end = key.split(":")[1];
      result[getTimeRangeString(start, end)] = preResult[key].length
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
        backgroundColor: "rgb(219, 234, 254, 0.7)",
        borderColor: "rgb(96 165 250)",
      },
    ],
  };

  return dataSet;
};

export const getDataForAreaPie = (
  list: DashboardSearchType[],
  distributionType: DistributionTypeKey,
  propertyType: PropertyType | RentalPropertyType,
  rental: boolean = false
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
  const spread = rental
    ? getPieSpreadRental(distributionType, propertyType === "garage_rental")
    : getPieSpread(distributionType, propertyType === "parking");
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

  const aboveSpread = total.filter((item) => item > spread[spread.length - 1]);

  if (aboveSpread.length) {
    result[`+${makeNumberCurrency(spread[spread.length - 1])}`] = aboveSpread;
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
  lang: LangType
): PieChartData => {
  if (list.length) {
    const longLabels: string[] = [];
    const longData: number[] = [];
    const labels: string[] = [];
    const dataPreset: Record<string, number[]> = {};
    const newDate = new Date(date);

    for (let index = 0; index < rangeMap[timeRange] - 1; index++) {
      if (index > 0) {
        newDate.setMonth(newDate?.getMonth() - 1);
      }
      const labelItem = excludeDayFromDateString(dateToDateString(newDate));
      labels.push(labelItem);
      dataPreset[labelItem] = [];
    }

    list.forEach((item) => {
      if (
        dataPreset[`${item.date?.split("-")[0]}-${item.date?.split("-")[1]}`]
      ) {
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
          `${formatDate(
            labels[base + (dividerMap[timeRange] - 1)],
            lang,
            false
          )} - ${formatDate(labels[base], lang, false)}`
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

export const getMapCircle = (lat: number, lng: number, range: number) => {
  // isPointInCircle is calculating if the point is in the circle
  const center = point([Number(lat), Number(lng)]);
  const circle = ellipse(center, Number(range), Number(range), {
    units: "meters",
  });

  // uniq is giving me values that I can use for the db
  const line = lineString(circle.geometry.coordinates[0]);
  const bbox1 = bbox(line);
  const bboxPolygon1 = bboxPolygon(bbox1);

  const uniq = [...new Set(bboxPolygon1.geometry.coordinates[0].flat())].sort(
    function (a, b) {
      return b - a;
    }
  );

  return {
    uniq,
    circle,
  };
};

export const transformDashboardRental = (
  rental: DashboardRentalType,
  type: PropertyType | RentalPropertyType
): DashboardSearchType => ({
  id: rental.id,
  lng: rental.link_id.lng,
  lat: rental.link_id.lat,
  municipality: "",
  date: rental.date_created,
  city: rental.city,
  price: rental.price,
  size: rental.size,
  description: rental.link_id.description,
  type,
});

export const getFeaturesReport = (details: Details[]): FeatureReportData => {
  const data = getFeaturesData(details);
  const essentials: Record<string, number>[] = [];
  const benefits: Record<string, number>[] = [];

  Object.keys(data).forEach((key: string) => {
    if (data[key as keyof typeof data]! > 40) {
      essentials.push({
        [key]: data[key as keyof typeof data]!,
      });
    }
    if (
      data[key as keyof typeof data]! < 40 &&
      data[key as keyof typeof data]! > 0
    ) {
      benefits.push({
        [key]: data[key as keyof typeof data]!,
      });
    }
  });

  return {
    essentials,
    benefits,
  };
};

const getFeaturesData = (details: Details[]): Features => {
  let furnished = 0;
  let interfon = 0;
  let camera = 0;
  let security = 0;
  let lift = 0;
  let terrace = 0;
  let balcony = 0;
  let reception = 0;
  let garage = 0;
  let parking = 0;
  let centralHeating = 0;
  let cableTv = 0;
  let internet = 0;
  let pets = 0;
  let aircon = 0;

  details.forEach((item) => {
    if (
      item.description?.includes("namešten") ||
      item.description?.includes("namesten") ||
      item.description?.includes("opremljen")
    )
      furnished = furnished + 1;
    if (item.security?.includes("Interfon")) interfon = interfon + 1;
    if (item.security?.includes("Video nadzor")) camera = camera + 1;
    if (item.security?.includes("Obezbeđenje")) security = security + 1;
    if (item.additional?.includes("Lift")) lift = lift + 1;
    if (item.additional?.includes("Terasa")) terrace = terrace + 1;
    if (
      item.additional?.includes("Balkon") ||
      item.additional?.includes("Lođa")
    )
      balcony = balcony + 1;
    if (item.additional?.includes("Recepcija")) reception = reception + 1;
    if (
      item.additional?.includes("Garaža") ||
      item.additional?.includes("Garažno mesto")
    )
      garage = garage + 1;
    if (item.additional?.includes("parking mesto")) parking = parking + 1;
    if (item.rest?.includes("Centralno grejanje"))
      centralHeating = centralHeating + 1;
    if (item.technical?.includes("Kablovska")) cableTv = cableTv + 1;
    if (item.technical?.includes("Internet")) internet = internet + 1;
    if (item.rest?.includes("Klima")) aircon = aircon + 1;
    if (
      item.rest?.includes("Kućni ljubimci") ||
      item.description?.toLowerCase().includes("pet friendly") ||
      item.description?.toLowerCase().includes("dozvoljeni kućni ljubimci")
    )
      pets = pets + 1;
  });

  return {
    furnished: Math.round((furnished / details.length) * 100),
    interfon: Math.round((interfon / details.length) * 100),
    camera: Math.round((camera / details.length) * 100),
    security: Math.round((security / details.length) * 100),
    lift: Math.round((lift / details.length) * 100),
    terrace: Math.min(
      Math.round((terrace / details.length) * 100) +
        Math.round((balcony / details.length) * 100),
      100
    ),
    reception: Math.round((reception / details.length) * 100),
    parking:
      Math.round((parking / details.length) * 100) +
      Math.round((garage / details.length) * 100),
    centralHeating: Math.round((centralHeating / details.length) * 100),
    cableTv: Math.round((cableTv / details.length) * 100),
    internet: Math.round((internet / details.length) * 100),
    aircon: Math.round((aircon / details.length) * 100),
    pets: Math.round((pets / details.length) * 100),
  };
};

const getDigitsFromString = (text: string): string[] => {
  const split = text.split("");
  const digits = split.filter((item) => /^\d+$/.test(item));

  return digits;
};

const isStreetNumber = (text: string): boolean => {
  const split = text.split("");
  const digits = getDigitsFromString(text);

  if (digits.length && split.length - digits.length < 2) {
    return true;
  }

  return false;
};

export const extractAddress = (address: string): string => {
  const addressSplit = address.split(",");
  const numberIndex: number | undefined = addressSplit.findIndex((item) => {
    if (isStreetNumber(item)) {
      if (Number(getDigitsFromString(item).join("")) < 1000) {
        return true;
      }
    }
  });

  const municipalityBase = addressSplit.find((item) => item.includes("("));
  const municipality =
    municipalityBase
      ?.split("(")[1]
      .substring(0, municipalityBase?.split("(")[1].length - 1) ||
    addressSplit.find((item) => item.includes("Gradska opština"));

  if (numberIndex > -1 && municipality !== undefined) {
    return `${addressSplit[numberIndex + 1]}, ${
      addressSplit[numberIndex]
    }, ${municipality}`;
  }

  return address;
};
