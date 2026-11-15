import type { SupportedCurrency } from '@/tools/shared/currency';

export type CouponFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly';

export interface EffectiveAnnualYieldInput {
  faceValue: string;
  annualCouponPayment: string;
  couponFrequency: CouponFrequency;
  currency: SupportedCurrency;
}

export interface EffectiveAnnualYieldResult {
  faceValue: number;
  annualCouponPayment: number;
  couponRatePercent: number;
  couponFrequency: CouponFrequency;
  compoundsPerYear: number;
  effectiveAnnualYieldPercent: number;
  currency: SupportedCurrency;
  formattedCouponRatePercent: string;
  formattedEffectiveAnnualYieldPercent: string;
}

export type EffectiveAnnualYieldFieldErrors = {
  faceValue?: string;
  annualCouponPayment?: string;
  form?: string;
};

export function createDefaultInput(): EffectiveAnnualYieldInput {
  return {
    faceValue: '',
    annualCouponPayment: '',
    couponFrequency: 'annually',
    currency: 'PKR',
  };
}
