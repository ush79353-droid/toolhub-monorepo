import type { SupportedCurrency } from '@/tools/shared/currency';

export interface InterestCoverageRatioInput {
  ebit: string;
  ebitCurrency: SupportedCurrency;
  interestExpense: string;
  interestExpenseCurrency: SupportedCurrency;
}

export interface InterestCoverageRatioResult {
  /** Full-precision coverage ratio (dimensionless). */
  coverageRatio: number;
  /** EBIT normalized into the calculation currency. */
  ebitNormalized: number;
  /** Interest expense normalized into the calculation currency. */
  interestExpenseNormalized: number;
  /** Currency used for the division (EBIT currency). */
  calcCurrency: SupportedCurrency;
  formattedCoverageRatio: string;
}

export type InterestCoverageRatioFieldErrors = {
  ebit?: string;
  interestExpense?: string;
  form?: string;
};

export function createDefaultInput(): InterestCoverageRatioInput {
  return {
    ebit: '400000',
    ebitCurrency: 'PKR',
    interestExpense: '100000',
    interestExpenseCurrency: 'PKR',
  };
}
