import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RvLoanInput {
  rvPrice: string;
  rvPriceCurrency: SupportedCurrency;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  termYears: string;
  termMonths: string;
  annualInterestRatePercent: string;
  loanAmountCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
  totalPaidCurrency: SupportedCurrency;
  costOfLoanCurrency: SupportedCurrency;
}

export interface RvLoanResult {
  loanAmountCalc: number;
  loanAmountDisplay: number;
  paymentCalc: number;
  paymentDisplay: number;
  totalPaidCalc: number;
  totalPaidDisplay: number;
  costOfLoanCalc: number;
  costOfLoanDisplay: number;
  paymentCount: number;
  calcCurrency: SupportedCurrency;
  formattedLoanAmount: string;
  formattedPayment: string;
  formattedTotalPaid: string;
  formattedCostOfLoan: string;
}

export type RvLoanFieldErrors = {
  rvPrice?: string;
  downPayment?: string;
  termYears?: string;
  termMonths?: string;
  annualInterestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): RvLoanInput {
  return {
    rvPrice: '',
    rvPriceCurrency: 'PKR',
    downPayment: '0.00',
    downPaymentCurrency: 'PKR',
    termYears: '',
    termMonths: '0',
    annualInterestRatePercent: '',
    loanAmountCurrency: 'PKR',
    paymentCurrency: 'PKR',
    totalPaidCurrency: 'PKR',
    costOfLoanCurrency: 'PKR',
  };
}
