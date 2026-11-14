import type { SupportedCurrency } from '@/tools/shared/currency';

export const BASE_YEAR_COUNT = 5;
export const EXTENDED_YEAR_COUNT = 10;

export type PaybackUnit = 'years' | 'months';

export type PaybackPeriodInput = {
  discountRate: string;
  initialInvestment: string;
  annualCashFlow: string;
  steadyPaybackUnit: PaybackUnit;
  steadyDiscountedUnit: PaybackUnit;
  yearCashFlows: string[];
  includeMoreYears: boolean;
  irregularPaybackUnit: PaybackUnit;
  irregularDiscountedUnit: PaybackUnit;
  currency: SupportedCurrency;
};

export type PaybackPeriodResult = {
  currency: SupportedCurrency;
  steadyPaybackYears: number | null;
  steadyDiscountedYears: number | null;
  steadyPaybackDisplay: string;
  steadyDiscountedDisplay: string;
  irregularPaybackYears: number | null;
  irregularDiscountedYears: number | null;
  irregularPaybackDisplay: string;
  irregularDiscountedDisplay: string;
};

export type PaybackPeriodFieldErrors = {
  discountRate?: string;
  initialInvestment?: string;
  annualCashFlow?: string;
  form?: string;
  years?: string;
};

export function createDefaultInput(): PaybackPeriodInput {
  return {
    discountRate: '',
    initialInvestment: '',
    annualCashFlow: '',
    steadyPaybackUnit: 'years',
    steadyDiscountedUnit: 'years',
    yearCashFlows: Array.from({ length: EXTENDED_YEAR_COUNT }, () => '0.00'),
    includeMoreYears: false,
    irregularPaybackUnit: 'years',
    irregularDiscountedUnit: 'years',
    currency: 'PKR',
  };
}
