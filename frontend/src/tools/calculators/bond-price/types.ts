import type { SupportedCurrency } from '@/tools/shared/currency';

/** Coupon frequencies already used across bond/loan calculators. */
export type CouponFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export const COUPON_FREQUENCY_OPTIONS: readonly {
  value: CouponFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semi-annually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
] as const;

export function periodsPerYear(frequency: CouponFrequency): number {
  const match = COUPON_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return match?.periodsPerYear ?? 1;
}

export interface BondPriceInput {
  faceValue: string;
  /** Canonical calculation currency for face value. */
  faceValueCurrency: SupportedCurrency;
  annualCouponRatePercent: string;
  couponFrequency: CouponFrequency;
  /** Independent display currency for coupon per period. */
  couponPerPeriodCurrency: SupportedCurrency;
  /** Independent display currency for annual coupon. */
  annualCouponCurrency: SupportedCurrency;
  yearsToMaturity: string;
  yieldToMaturityPercent: string;
  /** Independent display currency for bond price. */
  bondPriceCurrency: SupportedCurrency;
}

export interface BondPriceResult {
  /** Full-precision values in face-value currency. */
  annualCouponInFace: number;
  couponPerPeriodInFace: number;
  bondPriceInFace: number;
  periodsPerYear: number;
  totalPeriods: number;
  /** Display amounts after FX (full precision before formatters). */
  annualCoupon: number;
  couponPerPeriod: number;
  bondPrice: number;
  faceValueCurrency: SupportedCurrency;
  couponPerPeriodCurrency: SupportedCurrency;
  annualCouponCurrency: SupportedCurrency;
  bondPriceCurrency: SupportedCurrency;
  formattedAnnualCoupon: string;
  formattedCouponPerPeriod: string;
  formattedBondPrice: string;
}

export type BondPriceFieldErrors = {
  faceValue?: string;
  annualCouponRatePercent?: string;
  couponFrequency?: string;
  yearsToMaturity?: string;
  yieldToMaturityPercent?: string;
  form?: string;
};

export function createDefaultInput(): BondPriceInput {
  return {
    faceValue: '1000',
    faceValueCurrency: 'PKR',
    annualCouponRatePercent: '5',
    couponFrequency: 'annually',
    couponPerPeriodCurrency: 'PKR',
    annualCouponCurrency: 'PKR',
    yearsToMaturity: '10',
    yieldToMaturityPercent: '5',
    bondPriceCurrency: 'PKR',
  };
}
