import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Sequential triple percent-off:
 *   Final Price = Original Price × (1 − D1/100) × (1 − D2/100) × (1 − D3/100)
 *   Price Difference = Original Price − Final Price
 *   Effective Discount (%) = [1 − (1 − D1/100)(1 − D2/100)(1 − D3/100)] × 100
 *
 * Clamp: nonnegative price; each discount rate 0–100 inclusive.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculateTripleDiscount(input: {
  originalPrice: number;
  firstDiscountPercent: number;
  secondDiscountPercent: number;
  thirdDiscountPercent: number;
}): {
  finalPrice: number;
  priceDifference: number;
  effectiveDiscountPercent: number;
} | null {
  const {
    originalPrice,
    firstDiscountPercent,
    secondDiscountPercent,
    thirdDiscountPercent,
  } = input;
  if (
    ![
      originalPrice,
      firstDiscountPercent,
      secondDiscountPercent,
      thirdDiscountPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (originalPrice < 0) return null;
  if (firstDiscountPercent < 0 || firstDiscountPercent > 100) return null;
  if (secondDiscountPercent < 0 || secondDiscountPercent > 100) return null;
  if (thirdDiscountPercent < 0 || thirdDiscountPercent > 100) return null;

  const factor1 = 1 - firstDiscountPercent / 100;
  const factor2 = 1 - secondDiscountPercent / 100;
  const factor3 = 1 - thirdDiscountPercent / 100;
  const retention = factor1 * factor2 * factor3;
  const finalPrice = originalPrice * retention;
  const priceDifference = originalPrice - finalPrice;
  const effectiveDiscountPercent = (1 - retention) * 100;

  if (
    ![finalPrice, priceDifference, effectiveDiscountPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (finalPrice < 0) return null;

  return { finalPrice, priceDifference, effectiveDiscountPercent };
}

/** Display rounding only — never used inside the formulas. */
export function formatTripleDiscountMoney(
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
