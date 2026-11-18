import type { SupportedCurrency } from '@/tools/shared/currency';

export interface TimesInterestEarnedInput {
  ebit: string;
  ebitCurrency: SupportedCurrency;
  totalInterest: string;
  totalInterestCurrency: SupportedCurrency;
}

export interface TimesInterestEarnedResult {
  /** Full-precision TIE ratio (dimensionless). */
  tieRatio: number;
  /** EBIT normalized into the calculation currency. */
  ebitNormalized: number;
  /** Total interest normalized into the calculation currency. */
  totalInterestNormalized: number;
  /** Currency used for the division (EBIT currency). */
  calcCurrency: SupportedCurrency;
  formattedTieRatio: string;
}

export type TimesInterestEarnedFieldErrors = {
  ebit?: string;
  totalInterest?: string;
  form?: string;
};

export function createDefaultInput(): TimesInterestEarnedInput {
  return {
    ebit: '',
    ebitCurrency: 'PKR',
    totalInterest: '',
    totalInterestCurrency: 'PKR',
  };
}
