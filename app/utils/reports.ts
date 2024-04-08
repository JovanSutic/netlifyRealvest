import { DropdownOptions } from "../types/component.types";
import {
  CardsData,
  CardsDataCalculation,
  CardsDataInfo,
  CardsReport,
  DistributionTypeKey,
  GeneralObject,
  LangType,
  LineChartPreparedData,
  LineDataset,
  MainReportTableCalculation,
  MainReportTableData,
  MainReportType,
  PieChartData,
  PieReportType,
  PropertyType,
} from "../types/dashboard.types";
import { RangeOption, formatDate } from "./dateTime";
import { makeNumberCurrency, roundNumberToDecimal } from "./numbers";

const getListAverage = (list: number[], divider: number): number => {
  return list?.length
    ? (list || []).reduce((a: number, b: number) => a + b, 0) / divider
    : 0;
};

const packageTheReport = (
  calculation: Record<string, MainReportTableCalculation>
): Record<string, MainReportTableData> => {
  const result: Record<string, MainReportTableData> = {};

  Object.keys(calculation).forEach((key) => {
    const average = getListAverage(
      calculation[key].averageM2,
      calculation[key].averageM2.length
    );
    const averagePrice = getListAverage(
      calculation[key].averagePrice,
      calculation[key].count
    );
    const averageSize = getListAverage(
      calculation[key].averageSize,
      calculation[key].count
    );

    result[key] = {
      ...calculation[key],
      averageM2: roundNumberToDecimal(average, 0),
      averageSize: roundNumberToDecimal(averageSize, 0),
      averagePrice: roundNumberToDecimal(averagePrice, 0),
    };
  });

  return result;
};

const processDataForTable = (
  reports: MainReportType[]
): Record<string, MainReportTableCalculation> => {
  const result: Record<string, MainReportTableCalculation> = {};
  let test = 0;

  for (let index = 0; index < reports.length; index++) {
    const element = reports[index];
    if (element.municipality.id === 1) {
      test = test + element.average_meter_price;
    }
    if (!result[element.municipality.name]) {
      result[element.municipality.name] = {
        count: element.count,
        averageM2:
          element.average_meter_price > 0 ? [element.average_meter_price] : [],
        averagePrice: [element.sum_price],
        averageSize: element.sum_size > 0 ? [element.sum_size] : [],
      };
    } else {
      result[element.municipality.name].count =
        result[element.municipality.name].count + element.count;
      if (element.sum_price! > 0) {
        result[element.municipality.name].averagePrice!.push(
          element.sum_price!
        );
      }
      if (element.sum_size! > 0) {
        result[element.municipality.name].averageSize!.push(element.sum_size!);
      }
      if (element.average_meter_price > 0) {
        result[element.municipality.name].averageM2.push(
          element.average_meter_price
        );
      }
    }
  }

  return result;
};

export const getDataForMainReport = (
  reports: MainReportType[]
): Record<string, MainReportTableData> => {
  const result: Record<string, MainReportTableCalculation> =
    processDataForTable(reports);

  return packageTheReport(result);
};

export const listMainReportData = (
  data: Record<string, MainReportTableData>
): MainReportTableData[] => {
  const result: MainReportTableData[] = [];
  if (data) {
    Object.keys(data).forEach((key) => {
      result.push({ ...data[key], municipality: key });
    });
  }

  return result;
};

export const numbersToPercentage = (list: number[]): number[] => {
  const sum = list.reduce((total, item) => total + item);
  return list.map((item) => roundNumberToDecimal((item / sum) * 100, 1));
};

export const getOptions = (list: GeneralObject[]): DropdownOptions[] => {
  return list?.map((item) => ({ value: `${item.id}`, text: item.name }));
};

const getPieSpread = (
  key: DistributionTypeKey,
  isParking: boolean
): number[] => {
  if (isParking && key !== "average_price_map")
    return [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000];
  if (key === "average_price_map")
    return [1000, 1500, 2000, 2500, 3000, 3500, 4000];
  return [50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000];
};

export const getDataForPie = (
  list: PieReportType[],
  numericKey: DistributionTypeKey,
  propertyType: PropertyType
): PieChartData => {
  const total: number[] = [];
  list?.forEach((item) => total.push(...item[numericKey]));
  total.sort((a: number, b: number) => a - b);
  const spread = getPieSpread(numericKey, propertyType === "parking");
  let start = 0;
  const result: Record<string, number[]> = {};
  for (let index = 0; index < spread.length; index++) {
    const element = spread[index];
    const previousElement = index === 0 ? 0 : spread[index - 1];
    const mark = total.findIndex((item) => item >= element);
    const slice = mark > 0 ? total.slice(start, mark) : total.slice(start);
    if (slice.length) {
      result[
        `${makeNumberCurrency(previousElement)} - ${makeNumberCurrency(
          element
        )}`
      ] = slice;
    }
    start = mark > 0 ? mark : total.length;

    if (index === spread.length - 1) {
      if (total.slice(mark).length && mark > 0) {
        result[`${makeNumberCurrency(element)}+`] = total.slice(mark);
      }
    }
  }

  return {
    labels: Object.keys(result),
    data: Object.keys(result).map((key) => result[key].length),
  };
};

const getAverage = (list: MainReportType[]): number => {
  let sum = 0;
  let empty = 0;

  list.forEach((item) => {
    if (item.average_meter_price > 0) {
      sum = sum + item.average_meter_price;
    } else {
      empty = empty + 1;
    }
  });

  return sum / (list.length - empty) || 0;
};

const dividerMap: Record<string, number> = {
  "3m": 1,
  "6m": 1,
  "1y": 1,
  "3y": 3,
  "5y": 6,
  "10y": 12,
};

const calculateLineData = (
  data: MainReportType[],
  timeRange: RangeOption,
  lang: LangType
): LineChartPreparedData => {
  if (timeRange === "3y" || timeRange === "5y" || timeRange === "10y") {
    const result: Record<string, number> = {};
    let divider = 0;
    for (let index = 0; index < data.length; index++) {
      if (index === divider) {
        const nextDivider = divider + dividerMap[timeRange];
        const slice = data.slice(divider, nextDivider);
        result[formatDate(slice[0].date_to!, lang, false) || `${index}`] =
          getAverage(slice);
        divider = nextDivider;
      }
    }

    return {
      labels: Object.keys(result),
      data: Object.values(result),
    };
  }

  return {
    labels: data.map((item) => formatDate(item.date_to!, lang, false)),
    data: data.map((item) => item.average_meter_price),
  };
};

export const getSingleLineDataset = (
  data: MainReportType[],
  label: string,
  timeRange: RangeOption,
  lang: LangType = "sr"
): LineDataset => {
  const dataSet = {
    labels: calculateLineData(data, timeRange, lang).labels,
    datasets: [
      {
        label: label,
        data: calculateLineData(data, timeRange, lang).data,
        fill: true,
        backgroundColor: "rgba(240, 185, 11, 0.5)",
        borderColor: "rgba(240, 185, 11, 1)",
      },
    ],
  };

  return dataSet;
};

const prepareCardReportData = (data: MainReportType[]) => {
  const result: Record<string, MainReportType[]> = {};
  const final: CardsDataInfo[] = [];

  for (let index = 0; index < data.length; index++) {
    if (result[data[index].date_to]) {
      result[data[index].date_to].push(data[index]);
    } else {
      result[data[index].date_to] = [data[index]];
    }
  }

  Object.keys(result).map((key: keyof typeof result) => {
    const range: CardsDataCalculation = {
      count: 0,
      sum_price: 0,
      average_meter_price: [],
      sum_size: 0,
    };
    result[key].forEach((item) => {
      range.count = range.count + item.count;
      if (item.sum_price > 0) {
        range.sum_price = range.sum_price + item.sum_price;
      }

      if (item.sum_size > 0) {
        range.sum_size = range.sum_size + item.sum_size;
      }

      if (item.average_meter_price > 0) {
        range.average_meter_price.push(item.average_meter_price);
      }
    });

    final.push({
      count: range.count,
      sum_price: range.sum_price / range.count,
      sum_size: range.sum_size / range.count,
      average_meter_price:
        range.average_meter_price.reduce((a: number, b: number) => a + b, 0) /
        range.average_meter_price.length,
    });
  });

  return final;
}

export const getCardEffects = (
  data: MainReportType[],
  timeRange: RangeOption
): CardsData => {
  const result: CardsDataInfo[] = prepareCardReportData(data);

  const rangeData: CardsDataInfo[] = [];
  const completeData: CardsDataInfo[] = [];

  result.forEach((item, index) => {
    if (dividerMap[timeRange] > 1) {
      if ((index + 1) % dividerMap[timeRange] === 0) {
        const count = rangeData.reduce((a: number, b: CardsDataInfo) => a + b.count, 0);
        completeData.push({
          count,
          sum_price:
          rangeData.reduce((a: number, b: CardsDataInfo) => a + b.sum_price, 0) /
          rangeData.length,
          average_meter_price:
          rangeData.reduce(
              (a: number, b: CardsDataInfo) => a + b.average_meter_price,
              0
            ) / rangeData.length,
          sum_size:
          rangeData.reduce((a: number, b: CardsDataInfo) => a + b.sum_size, 0) /
          rangeData.length,
        });
      } else {
        rangeData.push(item);
      }
    } else {
      completeData.push(item);
    }
  });

  if (completeData.length) {
    return {
      sum_price: {
        value:
        completeData.reduce((a: number, b: CardsDataInfo) => a + b.sum_price, 0) /
        completeData.length,
        difference:
          ((completeData[completeData.length - 1].sum_price - completeData[0].sum_price) / completeData[0].sum_price) * 100,
      },
      average_meter_price: {
        value:
        completeData.reduce(
            (a: number, b: CardsDataInfo) => a + b.average_meter_price,
            0
          ) / completeData.length,
        difference:
          ((completeData[completeData.length - 1].average_meter_price - completeData[0].average_meter_price) /
          completeData[0].average_meter_price) *
          100,
      },
      sum_size: {
        value:
        completeData.reduce((a: number, b: CardsDataInfo) => a + b.sum_size, 0) /
        completeData.length,
        difference:
          ((completeData[completeData.length - 1].sum_size - completeData[0].sum_size) / completeData[0].sum_size) * 100,
      },
    };
  }

  return {
    sum_price: {
      value: 0,
      difference: 0,
    },
    average_meter_price: {
      value: 0,
      difference: 0,
    },
    sum_size: {
      value: 0,
      difference: 0,
    },
  };
};

export const prepareCardDataForDisplay = (data: CardsData): CardsReport => {
  return {
    averageM2: {
      labelKey: "cardAverageM2",
      changeValue: roundNumberToDecimal(data.average_meter_price.difference, 0),
      value: makeNumberCurrency(
        roundNumberToDecimal(
          data.average_meter_price.value,
          0
        )
      ),
    },
    averagePrice: {
      labelKey: "cardAveragePrice",
      changeValue: roundNumberToDecimal(data.sum_price.difference, 0),
      value: makeNumberCurrency(
        roundNumberToDecimal(data.sum_price.value, 0)
      ),
    },
    averageSize: {
      labelKey: "cardAverageSize",
      changeValue: roundNumberToDecimal(data.sum_size.difference, 0),
      value: makeNumberCurrency(
        roundNumberToDecimal(data.sum_size.value, 0),
        " m2"
      ),
    },
  };
}
