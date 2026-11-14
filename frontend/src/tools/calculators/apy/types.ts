import type { SupportedCurrency } from '@/tools/shared/currency';

/** Same compound set as Business Loan / amortization shared pattern. */
export type CompoundFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly'
  | 'daily';

export type TermUnit = 'mos' | 'yrs';

export interface ApyInput {
  initialDeposit: string;
  aprPercent: string;
  compoundFrequency: CompoundFrequency;
  term: string;
  termUnit: TermUnit;
  currency: SupportedCurrency;
}

export interface ApyResult {
  initialDeposit: number;
  aprPercent: number;
  compoundFrequency: CompoundFrequency;
  compoundsPerYear: number;
  termYears: number;
  term: number;
  termUnit: TermUnit;
  apyPercent: number;
  finalDeposit: number;
  currency: SupportedCurrency;
  formattedApyPercent: string;
  formattedFinalDeposit: string;
}

export type ApyFieldErrors = {
  initialDeposit?: string;
  aprPercent?: string;
  term?: string;
  form?: string;
};

export function createDefaultInput(): ApyInput {
  return {
    initialDeposit: '10000',
    aprPercent: '5',
    compoundFrequency: 'monthly',
    term: '12',
    termUnit: 'mos',
    currency: 'PKR',
  };
}
