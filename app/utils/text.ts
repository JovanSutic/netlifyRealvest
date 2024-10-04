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

export const getFirstWord = (text: string) => {
  // Trim the string to remove leading and trailing spaces
  const trimText = text.trim();

  // Split the string by spaces and return the first word
  return trimText.split(" ")[0] || ""; // Return an empty string if no words are found
};

export const getRandomString = (length: number) => {
  return (Math.random() + 1).toString(36).substring(length);
};

export const createSlug = (str: string): string => {
  // Convert to lowercase
  str = str.toLowerCase();

  // Remove special characters and replace spaces with hyphens
  str = str
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, "-") // Replace spaces with a single hyphen
    .replace(/--+/g, "-"); // Replace multiple hyphens with a single hyphen

  return str;
};
