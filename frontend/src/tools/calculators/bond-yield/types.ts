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

export interface BondYieldInput {
  faceValue: string;
  /** Currency of face value (canonical calculation currency after normalize). */
  faceValueCurrency: SupportedCurrency;
  bondPrice: string;
  /** Independent currency of the entered bond price. */
  bondPriceCurrency: SupportedCurrency;
  annualCouponRatePercent: string;
  couponFrequency: CouponFrequency;
  yearsToMaturity: string;
}

export interface BondYieldResult {
  /** Annual nominal YTM as a percent (full precision). */
  bondYieldPercent: number;
  periodsPerYear: number;
  totalPeriods: number;
  /** Face value and bond price after FX normalize into face currency. */
  faceValueInCalcCurrency: number;
  bondPriceInCalcCurrency: number;
  faceValueCurrency: SupportedCurrency;
  bondPriceCurrency: SupportedCurrency;
  formattedBondYieldPercent: string;
}

export type BondYieldFieldErrors = {
  faceValue?: string;
  bondPrice?: string;
  annualCouponRatePercent?: string;
  couponFrequency?: string;
  yearsToMaturity?: string;
  form?: string;
};

export function createDefaultInput(): BondYieldInput {
  return {
    faceValue: '1000',
    faceValueCurrency: 'PKR',
    bondPrice: '950',
    bondPriceCurrency: 'PKR',
    annualCouponRatePercent: '5',
    couponFrequency: 'annually',
    yearsToMaturity: '10',
  };
}
