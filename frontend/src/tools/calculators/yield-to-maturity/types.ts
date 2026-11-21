import type { SupportedCurrency } from '@/tools/shared/currency';

export type CouponFrequency = 1 | 2 | 4 | 12;

export type YieldToMaturitySolveTarget =
  | 'ytm'
  | 'bondPrice'
  | 'faceValue'
  | 'couponRate';

export const COUPON_FREQUENCY_OPTIONS: readonly {
  value: CouponFrequency;
  label: string;
}[] = [
  { value: 1, label: 'Annually (1/year)' },
  { value: 2, label: 'Semiannually (2/year)' },
  { value: 4, label: 'Quarterly (4/year)' },
  { value: 12, label: 'Monthly (12/year)' },
] as const;

export interface YieldToMaturityInput {
  solveTarget: YieldToMaturitySolveTarget;
  currency: SupportedCurrency;
  faceValue: string;
  bondPrice: string;
  annualCouponRatePercent: string;
  couponFrequency: CouponFrequency;
  yearsToMaturity: string;
  /** Used when solving for price / face / coupon */
  yieldToMaturityPercent: string;
}

export type BondPriceRelation = 'discount' | 'par' | 'premium';

export interface YieldToMaturityResult {
  solveTarget: YieldToMaturitySolveTarget;
  currency: SupportedCurrency;
  faceValue: number;
  bondPrice: number;
  annualCouponRatePercent: number;
  couponFrequency: CouponFrequency;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
  periodicYieldPercent: number;
  effectiveAnnualYieldPercent: number;
  currentYieldPercent: number;
  couponPayment: number;
  annualCouponIncome: number;
  numberOfPeriods: number;
  totalCouponIncome: number;
  totalCashReceived: number;
  capitalGainOrLoss: number;
  relation: BondPriceRelation;
  formattedFace: string;
  formattedPrice: string;
  formattedCouponRate: string;
  formattedYtm: string;
  formattedPeriodicYield: string;
  formattedEay: string;
  formattedCurrentYield: string;
  formattedCouponPayment: string;
  formattedAnnualCoupon: string;
  formattedTotalCoupons: string;
  formattedTotalCash: string;
  formattedCapitalGainLoss: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type YieldToMaturityFieldErrors = {
  form?: string;
  faceValue?: string;
  bondPrice?: string;
  annualCouponRatePercent?: string;
  couponFrequency?: string;
  yearsToMaturity?: string;
  yieldToMaturityPercent?: string;
};

export function createDefaultInput(): YieldToMaturityInput {
  return {
    solveTarget: 'ytm',
    currency: 'PKR',
    faceValue: '',
    bondPrice: '',
    annualCouponRatePercent: '',
    couponFrequency: 1,
    yearsToMaturity: '',
    yieldToMaturityPercent: '',
  };
}

export function createEmptyInput(): YieldToMaturityInput {
  return createDefaultInput();
}

/** Reference: F=1000, P=950, c=5%, annual, 10y → YTM ≈ 5.67%. */
export function createExampleInput(): YieldToMaturityInput {
  return {
    solveTarget: 'ytm',
    currency: 'USD',
    faceValue: '1000',
    bondPrice: '950',
    annualCouponRatePercent: '5',
    couponFrequency: 1,
    yearsToMaturity: '10',
    yieldToMaturityPercent: '',
  };
}
