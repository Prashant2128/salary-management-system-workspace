export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);

export const formatNullableCurrency = (value: number | null, currency = "USD") =>
  value === null ? "N/A" : formatCurrency(value, currency);
