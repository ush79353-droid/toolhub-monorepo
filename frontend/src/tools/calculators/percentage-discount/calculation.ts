import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Percent-off discount:
 *   Discount Amount = Price × Discount / 100
 *   Price After     = Price − Discount Amount
 *   You Save        = Discount Amount
 *
 * Clamp: nonnegative price; discount rate 0–100 inclusive.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculatePercentageDiscount(input: {
  priceBefore: number;
  discountPercent: number;
}): { discountAmount: number; priceAfter: number } | null {
  const { priceBefore, discountPercent } = input;
  if (![priceBefore, discountPercent].every(Number.isFinite)) {
    return null;
  }
  if (priceBefore < 0) return null;
  if (discountPercent < 0 || discountPercent > 100) return null;

  const discountAmount = (priceBefore * discountPercent) / 100;
  const priceAfter = priceBefore - discountAmount;

  if (![discountAmount, priceAfter].every(Number.isFinite)) {
    return null;
  }
  if (priceAfter < 0) return null;

  return { discountAmount, priceAfter };
}

/** Display rounding only — never used inside the formulas. */
export function formatPercentageDiscountMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
