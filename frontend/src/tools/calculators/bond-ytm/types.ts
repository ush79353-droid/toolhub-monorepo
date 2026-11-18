import type { SupportedCurrency } from '@/tools/shared/currency';

export type CouponFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly';

export const COUPON_FREQUENCY_OPTIONS: readonly {
  value: CouponFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
] as const;

export function periodsPerYear(frequency: CouponFrequency): number {
  const match = COUPON_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return match?.periodsPerYear ?? 1;
}

export interface BondYtmInput {
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

export interface BondYtmResult {
  /** Annual nominal YTM as a percent (full precision). */
  ytmPercent: number;
  periodsPerYear: number;
  totalPeriods: number;
  faceValueInCalcCurrency: number;
  bondPriceInCalcCurrency: number;
  faceValueCurrency: SupportedCurrency;
  bondPriceCurrency: SupportedCurrency;
  formattedYtmPercent: string;
}

export type BondYtmFieldErrors = {
  faceValue?: string;
  bondPrice?: string;
  annualCouponRatePercent?: string;
  couponFrequency?: string;
  yearsToMaturity?: string;
  form?: string;
};

/**
 * Sample defaults match the guide example (discount annual coupon bond).
 * Screenshot leaves fields blank; a filled sample makes the first paint useful.
 */
export function createDefaultInput(): BondYtmInput {
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
