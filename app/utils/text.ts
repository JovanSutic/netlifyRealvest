export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getNumbersFromString = (numberString: string) => {
  const result = numberString.replace(",", "").match(/-?\d+/g)?.map(Number) || [
    0,
  ];

  return result.length > 1
    ? parseFloat(result[0] + "." + result[1])
    : result[0];
};
