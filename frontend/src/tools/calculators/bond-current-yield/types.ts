import type { SupportedCurrency } from '@/tools/shared/currency';

export type CouponFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly';

export const COUPON_FREQUENCY_OPTIONS: readonly {
  value: CouponFrequency;
  label: string;
  paymentsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', paymentsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', paymentsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', paymentsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', paymentsPerYear: 12 },
] as const;

export interface BondCurrentYieldInput {
  faceValue: string;
  /** Canonical calculation currency for face value (and normalized bond price). */
  faceValueCurrency: SupportedCurrency;
  frequency: CouponFrequency;
  couponRatePercent: string;
  /** Independent display currency for coupon per period. */
  couponPerPeriodCurrency: SupportedCurrency;
  /** Independent display currency for annual coupon. */
  annualCouponCurrency: SupportedCurrency;
  bondPrice: string;
  /** Independent currency of the entered bond price. */
  bondPriceCurrency: SupportedCurrency;
  annualCouponOpen: boolean;
  bondYieldOpen: boolean;
}

export interface BondCurrentYieldResult {
  /** Full-precision annual coupon in face-value currency. */
  annualCouponInFaceCurrency: number;
  /** Full-precision coupon per period in face-value currency. */
  couponPerPeriodInFaceCurrency: number;
  annualCoupon: number;
  couponPerPeriod: number;
  currentYieldPercent: number;
  faceValueCurrency: SupportedCurrency;
  couponPerPeriodCurrency: SupportedCurrency;
  annualCouponCurrency: SupportedCurrency;
  bondPriceCurrency: SupportedCurrency;
  formattedAnnualCoupon: string;
  formattedCouponPerPeriod: string;
  formattedCurrentYieldPercent: string;
  paymentsPerYear: number;
}

export type BondCurrentYieldFieldErrors = {
  faceValue?: string;
  frequency?: string;
  couponRatePercent?: string;
  bondPrice?: string;
  form?: string;
};

export function createDefaultInput(): BondCurrentYieldInput {
  return {
    faceValue: '1000',
    faceValueCurrency: 'PKR',
    frequency: 'annually',
    couponRatePercent: '5',
    couponPerPeriodCurrency: 'PKR',
    annualCouponCurrency: 'PKR',
    bondPrice: '980',
    bondPriceCurrency: 'PKR',
    annualCouponOpen: true,
    bondYieldOpen: true,
  };
}
