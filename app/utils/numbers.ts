export const isNumber = (value: string | number): boolean => {
  if (typeof value === "number") return true;
  if (typeof value === "string" && !value.length) return false;
  if (typeof value !== "string" && typeof value !== "number") return false;

  return !Number.isNaN(Number(value.replace(",", ".")));
};

export const makeNumberCurrency = (num: number, currency: string = "€") => {
  return `${(num || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}${currency}`;
}

export const roundNumberToDecimal = (
  num: number,
  decimalPlace: number
): number => {
  if (!isNumber(num) || !isNumber(decimalPlace)) return 0;
  return Number((Math.round(num * 100) / 100).toFixed(decimalPlace));
};
