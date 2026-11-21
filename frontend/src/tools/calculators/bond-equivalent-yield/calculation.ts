/**
 * Investment-basis bond equivalent yield (BEY) for discount instruments.
 *
 * BEY (%) = ((Face Value − Bond Price) / Bond Price) × (365 / Days to Maturity) × 100
 *
 * Convention: actual/365 day count (not 360-day bank discount). Inputs must already
 * share one currency. This is not bank discount yield, YTM, or coupon current yield.
 * Full precision is preserved; callers round only for display.
 */

/** Actual/365 convention for investment-basis BEY. */
export const BEY_DAYS_PER_YEAR = 365;

/** Display rounding for BEY percent (not used in math). */
export function formatBeyPercent(beyPercent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(beyPercent);
}

/**
 * Returns full-precision BEY percent, or null when inputs are non-finite / invalid
 * for the supported discount-instrument scenario.
 */
export function calculateBondEquivalentYield(input: {
  bondPrice: number;
  faceValue: number;
  daysToMaturity: number;
}): number | null {
  const { bondPrice, faceValue, daysToMaturity } = input;

  if (![bondPrice, faceValue, daysToMaturity].every(Number.isFinite)) {
    return null;
  }
  if (!(bondPrice > 0) || !(faceValue > 0) || !(daysToMaturity > 0)) {
    return null;
  }
  // Discount / par only — premium bonds are outside this BEY scenario.
  if (bondPrice > faceValue) {
    return null;
  }

  // Par: zero discount → zero BEY (avoids a meaningless 0/price ratio path).
  if (bondPrice === faceValue) {
    return 0;
  }

  const holdingPeriodReturn = (faceValue - bondPrice) / bondPrice;
  const annualization = BEY_DAYS_PER_YEAR / daysToMaturity;
  const beyPercent = holdingPeriodReturn * annualization * 100;

  if (!Number.isFinite(beyPercent)) {
    return null;
  }

  return beyPercent;
}
