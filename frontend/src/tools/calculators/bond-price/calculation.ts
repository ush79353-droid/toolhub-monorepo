import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CouponFrequency } from './types';
import { periodsPerYear } from './types';

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

/**
 * Regular coupon-date (clean price) assumption: settlement is on a coupon date,
 * so there is no accrued interest. N = years × m must be a positive whole number
 * of coupon periods.
 *
 * Annual coupon = F × r
 * Coupon per period = F × r / m
 * Bond price (y ≠ 0):
 *   P = Σ_{t=1..N} (F r / m) / (1 + y/m)^t + F / (1 + y/m)^N
 *     = C × (1 − (1+i)^{−N}) / i + F / (1+i)^N
 * Zero YTM limit: P = C × N + F
 */
export function calculateBondPrice(input: {
  faceValue: number;
  annualCouponRatePercent: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
}): {
  annualCoupon: number;
  couponPerPeriod: number;
  bondPrice: number;
  periodsPerYear: number;
  totalPeriods: number;
} | null {
  const {
    faceValue: F,
    annualCouponRatePercent,
    couponFrequency,
    yearsToMaturity,
    yieldToMaturityPercent,
  } = input;

  if (
    ![F, annualCouponRatePercent, yearsToMaturity, yieldToMaturityPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(F > 0) || !(yearsToMaturity > 0)) {
    return null;
  }
  if (annualCouponRatePercent < 0 || yieldToMaturityPercent < 0) {
    return null;
  }

  const m = periodsPerYear(couponFrequency);
  if (!(m > 0) || !Number.isFinite(m)) {
    return null;
  }

  const rawPeriods = yearsToMaturity * m;
  // Reject fractional coupon periods under the regular coupon-date assumption.
  if (
    !Number.isFinite(rawPeriods) ||
    rawPeriods <= 0 ||
    Math.abs(rawPeriods - Math.round(rawPeriods)) > 1e-9
  ) {
    return null;
  }
  const N = Math.round(rawPeriods);
  // Guard overflow / absurd schedules (e.g. weekly × very long maturity).
  if (N > 100_000) {
    return null;
  }

  const r = annualCouponRatePercent / 100;
  const y = yieldToMaturityPercent / 100;
  const annualCoupon = F * r;
  const couponPerPeriod = annualCoupon / m;

  if (![annualCoupon, couponPerPeriod].every(Number.isFinite)) {
    return null;
  }

  let bondPrice: number;
  if (y === 0) {
    // lim y→0 of the discount formula
    bondPrice = couponPerPeriod * N + F;
  } else {
    const i = y / m;
    if (!(1 + i > 0) || !Number.isFinite(i)) {
      return null;
    }
    const discountFactor = Math.pow(1 + i, -N);
    if (!Number.isFinite(discountFactor) || discountFactor <= 0) {
      return null;
    }
    const annuityFactor = (1 - discountFactor) / i;
    if (!Number.isFinite(annuityFactor)) {
      return null;
    }
    bondPrice = couponPerPeriod * annuityFactor + F * discountFactor;
  }

  if (!Number.isFinite(bondPrice)) {
    return null;
  }

  return {
    annualCoupon,
    couponPerPeriod,
    bondPrice,
    periodsPerYear: m,
    totalPeriods: N,
  };
}
