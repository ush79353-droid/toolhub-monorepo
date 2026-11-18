import type { SupportedCurrency } from '@/tools/shared/currency';

export interface StudentLoanInput {
  loanBalance: string;
  /** Currency of the loan balance (canonical calculation currency). */
  loanCurrency: SupportedCurrency;
  termYears: string;
  termMonths: string;
  annualInterestRatePercent: string;
  /** Independent display currency for monthly payment. */
  monthlyPaymentCurrency: SupportedCurrency;
}

export interface StudentLoanResult {
  monthlyPaymentInLoanCurrency: number;
  monthlyPayment: number;
  monthlyPaymentCurrency: SupportedCurrency;
  formattedMonthlyPayment: string;
  paymentCount: number;
}

export type StudentLoanFieldErrors = {
  loanBalance?: string;
  termYears?: string;
  termMonths?: string;
  annualInterestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): StudentLoanInput {
  return {
    loanBalance: '',
    loanCurrency: 'PKR',
    termYears: '10',
    termMonths: '0',
    annualInterestRatePercent: '6',
    monthlyPaymentCurrency: 'PKR',
  };
}
