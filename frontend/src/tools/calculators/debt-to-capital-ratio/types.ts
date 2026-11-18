import type { SupportedCurrency } from '@/tools/shared/currency';

export interface DebtToCapitalRatioInput {
  interestBearingDebt: string;
  interestBearingDebtCurrency: SupportedCurrency;
  shareholdersEquity: string;
  shareholdersEquityCurrency: SupportedCurrency;
}

export interface DebtToCapitalRatioResult {
  /** Full-precision debt-to-capital ratio (dimensionless). */
  debtToCapitalRatio: number;
  interestBearingDebtNormalized: number;
  shareholdersEquityNormalized: number;
  totalCapitalNormalized: number;
  /** Currency used for the division (debt currency). */
  calcCurrency: SupportedCurrency;
  formattedDebtToCapitalRatio: string;
}

export type DebtToCapitalRatioFieldErrors = {
  interestBearingDebt?: string;
  shareholdersEquity?: string;
  form?: string;
};

export function createDefaultInput(): DebtToCapitalRatioInput {
  return {
    interestBearingDebt: '400000',
    interestBearingDebtCurrency: 'PKR',
    shareholdersEquity: '600000',
    shareholdersEquityCurrency: 'PKR',
  };
}
