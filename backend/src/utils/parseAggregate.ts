export const toNumber = (value: string | number | null | undefined, fallback = 0): number => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return Number(value);
};

export const toNullableNumber = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return Number(value);
};
