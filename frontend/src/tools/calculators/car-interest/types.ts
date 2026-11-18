import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CarInterestInput {
  carPrice: string;
  carPriceCurrency: SupportedCurrency;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  tradeInValue: string;
  tradeInCurrency: SupportedCurrency;
  /** Display currency for the calculated loan amount (canonical calc currency). */
  loanAmountCurrency: SupportedCurrency;
  interestRatePercent: string;
  termYears: string;
  termMonths: string;
  monthlyPaymentCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
}

export interface CarInterestResult {
  loanAmountCalc: number;
  loanAmountDisplay: number;
  paymentCount: number;
  monthlyPaymentCalc: number;
  monthlyPaymentDisplay: number;
  totalInterestCalc: number;
  totalInterestDisplay: number;
  calcCurrency: SupportedCurrency;
  formattedLoanAmount: string;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
}

export type CarInterestFieldErrors = {
  carPrice?: string;
  downPayment?: string;
  tradeInValue?: string;
  interestRatePercent?: string;
  termYears?: string;
  termMonths?: string;
  form?: string;
};

export function createDefaultInput(): CarInterestInput {
  return {
    carPrice: '',
    carPriceCurrency: 'PKR',
    downPayment: '0',
    downPaymentCurrency: 'PKR',
    tradeInValue: '0',
    tradeInCurrency: 'PKR',
    loanAmountCurrency: 'PKR',
    interestRatePercent: '',
    termYears: '5',
    termMonths: '0',
    monthlyPaymentCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
  };
}
