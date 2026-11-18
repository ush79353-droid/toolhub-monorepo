import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatCouponMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for current yield percent (not used in math). */
export function formatYieldPercent(yieldPercent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(yieldPercent);
}

/**
 * Annual Coupon = Face Value × Annual Coupon Rate / 100
 * Coupon Payment = Annual Coupon / Payments Per Annum
 * Current Yield (%) = Annual Coupon / Market Price × 100
 *
 * Returns full-precision values in the face-value currency. FX belongs in validation.
 */
export function calculateCouponPayment(input: {
  faceValue: number;
  annualCouponRatePercent: number;
  paymentsPerAnnum: number;
  marketPrice?: number | null;
}): {
  annualCoupon: number;
  couponPayment: number;
  currentYieldPercent: number | null;
} | null {
  const { faceValue, annualCouponRatePercent, paymentsPerAnnum, marketPrice } =
    input;

  if (
    ![faceValue, annualCouponRatePercent, paymentsPerAnnum].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(faceValue > 0) || !(paymentsPerAnnum > 0)) {
    return null;
  }
  if (annualCouponRatePercent < 0) {
    return null;
  }

  const annualCoupon = faceValue * (annualCouponRatePercent / 100);
  const couponPayment = annualCoupon / paymentsPerAnnum;

  if (![annualCoupon, couponPayment].every(Number.isFinite)) {
    return null;
  }

  let currentYieldPercent: number | null = null;
  if (
    marketPrice !== undefined &&
    marketPrice !== null &&
    Number.isFinite(marketPrice) &&
    marketPrice > 0
  ) {
    const yieldPercent = (annualCoupon / marketPrice) * 100;
    currentYieldPercent = Number.isFinite(yieldPercent) ? yieldPercent : null;
  }

  return { annualCoupon, couponPayment, currentYieldPercent };
}
