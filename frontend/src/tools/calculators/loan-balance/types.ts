import type { SupportedCurrency } from '@/tools/shared/currency';

export interface LoanBalanceInput {
  loanAmount: string;
  interestRatePercent: string;
  termYears: string;
  termMonths: string;
  periodYears: string;
  periodMonths: string;
  /** Currency of the loan principal (calculation currency). */
  currency: SupportedCurrency;
  /** Independent display currency for remaining balance. */
  resultCurrency: SupportedCurrency;
}

export interface LoanBalanceResult {
  /** Full-precision remaining balance in `currency` (result / display currency). */
  loanRemaining: number;
  /** Full-precision remaining balance in the loan principal's currency. */
  loanRemainingInLoanCurrency: number;
  monthlyPayment: number;
  termMonthsTotal: number;
  elapsedMonths: number;
  currency: SupportedCurrency;
  loanCurrency: SupportedCurrency;
  formattedLoanRemaining: string;
}

export type LoanBalanceFieldErrors = {
  loanAmount?: string;
  interestRatePercent?: string;
  termYears?: string;
  termMonths?: string;
  periodYears?: string;
  periodMonths?: string;
  form?: string;
};

export function createDefaultInput(): LoanBalanceInput {
  return {
    loanAmount: '',
    interestRatePercent: '',
    termYears: '',
    termMonths: '',
    periodYears: '',
    periodMonths: '',
    currency: 'PKR',
    resultCurrency: 'PKR',
  };
}
