import type { SupportedCurrency } from '@/tools/shared/currency';
import type { CouponFrequency, EffectiveAnnualYieldResult } from './types';

export function compoundsPerYear(frequency: CouponFrequency): number {
  switch (frequency) {
    case 'annually':
      return 1;
    case 'semiannually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
  }
}

function formatPercent(percent: number): string {
  const rounded = Math.round(percent * 10000) / 10000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Coupon Rate (%) = (Annual Coupon Payment / Face Value) × 100
 * Effective Annual Yield (%) = [(1 + r/n)^n − 1] × 100
 * where r = coupon rate as decimal, n = payments per year.
 * Coupon-rate-based EAY with reinvestment at the periodic coupon rate — not YTM.
 */
export function calculateEffectiveAnnualYield(
  faceValue: number,
  annualCouponPayment: number,
  couponFrequency: CouponFrequency,
  currency: SupportedCurrency
): EffectiveAnnualYieldResult | null {
  if (!Number.isFinite(faceValue) || !Number.isFinite(annualCouponPayment)) return null;
  if (!(faceValue > 0)) return null;
  if (annualCouponPayment < 0) return null;

  const couponRatePercent = (annualCouponPayment / faceValue) * 100;
  if (!Number.isFinite(couponRatePercent)) return null;

  const n = compoundsPerYear(couponFrequency);
  if (!(n > 0)) return null;

  const r = couponRatePercent / 100;
  const periodicFactor = 1 + r / n;
  if (!(periodicFactor > 0) || !Number.isFinite(periodicFactor)) return null;

  const effectiveAnnualYieldPercent = (periodicFactor ** n - 1) * 100;
  if (!Number.isFinite(effectiveAnnualYieldPercent)) return null;

  return {
    faceValue,
    annualCouponPayment,
    couponRatePercent,
    couponFrequency,
    compoundsPerYear: n,
    effectiveAnnualYieldPercent,
    currency,
    formattedCouponRatePercent: formatPercent(couponRatePercent),
    formattedEffectiveAnnualYieldPercent: formatPercent(effectiveAnnualYieldPercent),
  };
}
