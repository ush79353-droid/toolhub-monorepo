import type { SupportedCurrency } from '@/tools/shared/currency';

export type EffectiveDurationMode = 'standard' | 'scenario';

export type BondCouponFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly';

export const BOND_FREQUENCY_OPTIONS: readonly {
  id: BondCouponFrequency;
  label: string;
  paymentsPerYear: number;
}[] = [
  { id: 'annually', label: 'Annually (1/year)', paymentsPerYear: 1 },
  { id: 'semiannually', label: 'Semiannually (2/year)', paymentsPerYear: 2 },
  { id: 'quarterly', label: 'Quarterly (4/year)', paymentsPerYear: 4 },
  { id: 'monthly', label: 'Monthly (12/year)', paymentsPerYear: 12 },
] as const;

export const BOND_FREQUENCY_MAP: Record<BondCouponFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
};

export interface EffectiveDurationInput {
  mode: EffectiveDurationMode;
  currency: SupportedCurrency;
  faceValue: string;
  annualCouponRatePercent: string;
  frequency: BondCouponFrequency;
  yearsToMaturity: string;
  yieldToMaturityPercent: string;
  /** Yield differential in percentage points (UI), e.g. 1 = 1 pp = 0.01 */
  yieldDifferentialPercent: string;
  /** Scenario mode prices */
  basePrice: string;
  priceYieldDown: string;
  priceYieldUp: string;
}

export interface EffectiveDurationResult {
  mode: EffectiveDurationMode;
  currency: SupportedCurrency;
  couponPerPeriod: number;
  annualCoupon: number;
  faceValue: number;
  annualCouponRatePercent: number;
  frequency: BondCouponFrequency;
  paymentsPerYear: number;
  yearsToMaturity: number;
  yieldToMaturityPercent: number;
  yieldDifferentialDecimal: number;
  basePrice: number;
  priceYieldDown: number;
  priceYieldUp: number;
  effectiveDuration: number;
  pctChangeUp: number;
  pctChangeDown: number;
  approxPriceImpactUp: number;
  dollarDuration: number;
  dv01: number;
  effectiveConvexity: number;
  formattedCouponPerPeriod: string;
  formattedAnnualCoupon: string;
  formattedBasePrice: string;
  formattedPriceDown: string;
  formattedPriceUp: string;
  formattedDuration: string;
  formattedPctChangeUp: string;
  formattedPctChangeDown: string;
  formattedDv01: string;
  formattedConvexity: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  modeLabel: string;
}

export type EffectiveDurationFieldErrors = {
  form?: string;
  faceValue?: string;
  annualCouponRatePercent?: string;
  frequency?: string;
  yearsToMaturity?: string;
  yieldToMaturityPercent?: string;
  yieldDifferentialPercent?: string;
  basePrice?: string;
  priceYieldDown?: string;
  priceYieldUp?: string;
};

export function createDefaultInput(): EffectiveDurationInput {
  return {
    mode: 'standard',
    currency: 'USD',
    faceValue: '',
    annualCouponRatePercent: '',
    frequency: 'annually',
    yearsToMaturity: '',
    yieldToMaturityPercent: '',
    yieldDifferentialPercent: '',
    basePrice: '',
    priceYieldDown: '',
    priceYieldUp: '',
  };
}

export function createEmptyInput(): EffectiveDurationInput {
  return createDefaultInput();
}

/** Par bond example → duration ≈ 2.58 years. */
export function createExampleInput(): EffectiveDurationInput {
  return {
    mode: 'standard',
    currency: 'USD',
    faceValue: '10000',
    annualCouponRatePercent: '8',
    frequency: 'annually',
    yearsToMaturity: '3',
    yieldToMaturityPercent: '8',
    yieldDifferentialPercent: '1',
    basePrice: '',
    priceYieldDown: '',
    priceYieldUp: '',
  };
}
