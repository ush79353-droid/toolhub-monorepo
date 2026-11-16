import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';

export interface BoatLoanInput {
  loanAmount: string;
  /** Currency of the loan principal (canonical calculation currency). */
  loanCurrency: SupportedCurrency;
  loanTerm: string;
  termUnit: TermUnit;
  annualInterestRatePercent: string;
  /** Independent display currency for monthly payment. */
  monthlyPaymentCurrency: SupportedCurrency;
  /** Independent display currency for total interest paid. */
  totalInterestCurrency: SupportedCurrency;
}

export interface BoatLoanResult {
  monthlyPaymentInLoanCurrency: number;
  monthlyPayment: number;
  monthlyPaymentCurrency: SupportedCurrency;
  formattedMonthlyPayment: string;
  totalInterestInLoanCurrency: number;
  totalInterest: number;
  totalInterestCurrency: SupportedCurrency;
  formattedTotalInterest: string;
  paymentCount: number;
}

export type BoatLoanFieldErrors = {
  loanAmount?: string;
  loanTerm?: string;
  annualInterestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): BoatLoanInput {
  return {
    loanAmount: '',
    loanCurrency: 'PKR',
    loanTerm: '5',
    termUnit: 'yrs',
    annualInterestRatePercent: '5',
    monthlyPaymentCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
  };
}
