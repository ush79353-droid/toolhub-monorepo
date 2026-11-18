import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CouponFrequency } from './types';
import { COUPON_FREQUENCY_OPTIONS } from './types';

export function paymentsPerYearForFrequency(
  frequency: CouponFrequency
): number | null {
  const match = COUPON_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return match ? match.paymentsPerYear : null;
}

export function formatBondMoney(
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
 * Annual Coupon = Face Value × Coupon Rate / 100
 * Coupon Per Period = Annual Coupon / Payments Per Year
 * Current Yield (%) = Annual Coupon / Bond Price × 100
 *
 * Inputs must already be in one common currency. Returns full-precision values.
 * Current yield is not yield to maturity.
 */
export function calculateBondCurrentYield(input: {
  faceValue: number;
  couponRatePercent: number;
  paymentsPerYear: number;
  bondPrice: number;
}): {
  annualCoupon: number;
  couponPerPeriod: number;
  currentYieldPercent: number;
} | null {
  const { faceValue, couponRatePercent, paymentsPerYear, bondPrice } = input;

  if (
    ![faceValue, couponRatePercent, paymentsPerYear, bondPrice].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(faceValue > 0) || !(bondPrice > 0) || !(paymentsPerYear > 0)) {
    return null;
  }
  if (couponRatePercent < 0) {
    return null;
  }

  const annualCoupon = faceValue * (couponRatePercent / 100);
  const couponPerPeriod = annualCoupon / paymentsPerYear;
  const currentYieldPercent = (annualCoupon / bondPrice) * 100;

  if (
    ![annualCoupon, couponPerPeriod, currentYieldPercent].every(Number.isFinite)
  ) {
    return null;
  }

  return { annualCoupon, couponPerPeriod, currentYieldPercent };
}
