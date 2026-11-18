import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Percent-off discount:
 *   Discount Amount = Original Price × Discount Rate / 100
 *   Final Price     = Original Price − Discount Amount
 *   Savings         = Discount Amount
 *
 * Clamp: nonnegative price; discount rate 0–100 inclusive.
 * Tax included is a UI label only and is not part of this pure engine.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculatePercentOffDiscount(input: {
  originalPrice: number;
  discountPercent: number;
}): { discountAmount: number; finalPrice: number } | null {
  const { originalPrice, discountPercent } = input;
  if (![originalPrice, discountPercent].every(Number.isFinite)) {
    return null;
  }
  if (originalPrice < 0) return null;
  if (discountPercent < 0 || discountPercent > 100) return null;

  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  if (![discountAmount, finalPrice].every(Number.isFinite)) {
    return null;
  }
  if (finalPrice < 0) return null;

  return { discountAmount, finalPrice };
}

/** Display rounding only — never used inside the formulas. */
export function formatDiscountMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
