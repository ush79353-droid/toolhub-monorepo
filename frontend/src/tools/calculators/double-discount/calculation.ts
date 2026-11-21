import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Sequential double percent-off:
 *   Final Price = Original Price × (1 − D1/100) × (1 − D2/100)
 *   Total Savings = Original Price − Final Price
 *   Effective Discount (%) = D1 + D2 − (D1 × D2 / 100)
 *
 * Clamp: nonnegative price; each discount rate 0–100 inclusive.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculateDoubleDiscount(input: {
  originalPrice: number;
  firstDiscountPercent: number;
  secondDiscountPercent: number;
}): {
  finalPrice: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
} | null {
  const { originalPrice, firstDiscountPercent, secondDiscountPercent } = input;
  if (
    ![originalPrice, firstDiscountPercent, secondDiscountPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (originalPrice < 0) return null;
  if (firstDiscountPercent < 0 || firstDiscountPercent > 100) return null;
  if (secondDiscountPercent < 0 || secondDiscountPercent > 100) return null;

  const finalPrice =
    originalPrice *
    (1 - firstDiscountPercent / 100) *
    (1 - secondDiscountPercent / 100);
  const totalSavings = originalPrice - finalPrice;
  const effectiveDiscountPercent =
    firstDiscountPercent +
    secondDiscountPercent -
    (firstDiscountPercent * secondDiscountPercent) / 100;

  if (
    ![finalPrice, totalSavings, effectiveDiscountPercent].every(Number.isFinite)
  ) {
    return null;
  }
  if (finalPrice < 0) return null;

  return { finalPrice, totalSavings, effectiveDiscountPercent };
}

/** Display rounding only — never used inside the formulas. */
export function formatDoubleDiscountMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for the effective percent (never FX-converted). */
export function formatEffectiveDiscountPercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(percent);
}
