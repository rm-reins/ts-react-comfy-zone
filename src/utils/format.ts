/**
 * Format a number as a price with currency symbol
 */
export const formatPrice = (num: number): string => {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  return formatter.format(num);
};
