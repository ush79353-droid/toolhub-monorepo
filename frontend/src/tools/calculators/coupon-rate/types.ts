import type { SupportedCurrency } from '@/tools/shared/currency';

export type CouponFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'bimonthly'
  | 'weekly';

export type CouponSolveTarget =
  | 'couponRate'
  | 'couponPerPeriod'
  | 'annualCoupon'
  | 'faceValue';

export const COUPON_FREQUENCY_OPTIONS: readonly {
  id: CouponFrequency;
  label: string;
  paymentsPerYear: number;
}[] = [
  { id: 'annually', label: 'Annually', paymentsPerYear: 1 },
  { id: 'semiannually', label: 'Semiannually', paymentsPerYear: 2 },
  { id: 'quarterly', label: 'Quarterly', paymentsPerYear: 4 },
  { id: 'bimonthly', label: 'Every two months', paymentsPerYear: 6 },
  { id: 'monthly', label: 'Monthly', paymentsPerYear: 12 },
  { id: 'weekly', label: 'Weekly', paymentsPerYear: 52 },
] as const;

export const FREQUENCY_MAP: Record<CouponFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  bimonthly: 6,
  monthly: 12,
  weekly: 52,
};

export interface CouponRateInput {
  currency: SupportedCurrency;
  solveTarget: CouponSolveTarget;
  faceValue: string;
  couponPerPeriod: string;
  frequency: CouponFrequency;
  annualCoupon: string;
  couponRatePercent: string;
}

export interface CouponRateResult {
  currency: SupportedCurrency;
  solveTarget: CouponSolveTarget;
  frequency: CouponFrequency;
  frequencyLabel: string;
  paymentsPerYear: number;
  faceValue: number;
  couponPerPeriod: number;
  annualCoupon: number;
  couponRateDecimal: number;
  couponRatePercent: number;
  isZeroCoupon: boolean;
  formattedFaceValue: string;
  formattedCouponPerPeriod: string;
  formattedAnnualCoupon: string;
  formattedCouponRate: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type CouponRateFieldErrors = {
  form?: string;
  faceValue?: string;
  couponPerPeriod?: string;
  frequency?: string;
  annualCoupon?: string;
  couponRatePercent?: string;
};

export function createDefaultInput(): CouponRateInput {
  return {
    currency: 'USD',
    solveTarget: 'couponRate',
    faceValue: '',
    couponPerPeriod: '',
    frequency: 'annually',
    annualCoupon: '',
    couponRatePercent: '',
  };
}

export function createEmptyInput(): CouponRateInput {
  return createDefaultInput();
}

/** Worked example: $1,000 face · $25 semi · 5% coupon rate. */
export function createExampleInput(): CouponRateInput {
  return {
    currency: 'USD',
    solveTarget: 'couponRate',
    faceValue: '1000',
    couponPerPeriod: '25',
    frequency: 'semiannually',
    annualCoupon: '',
    couponRatePercent: '',
  };
}

export function frequencyLabel(id: CouponFrequency): string {
  return (
    COUPON_FREQUENCY_OPTIONS.find((o) => o.id === id)?.label ?? id
  );
}
