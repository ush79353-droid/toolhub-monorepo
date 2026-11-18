import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CarLoanEmiInput {
  carPrice: string;
  carPriceCurrency: SupportedCurrency;
  moneyYouHave: string;
  moneyYouHaveCurrency: SupportedCurrency;
  tradeInValue: string;
  tradeInCurrency: SupportedCurrency;
  salesTaxPercent: string;
  /** Display + canonical calc currency for the financed loan amount. */
  loanAmountCurrency: SupportedCurrency;
  interestRatePercent: string;
  termYears: string;
  termMonths: string;
  monthlyPaymentCurrency: SupportedCurrency;
  totalInterestCurrency: SupportedCurrency;
}

export interface CarLoanEmiResult {
  salesTaxAmountCalc: number;
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

export type CarLoanEmiFieldErrors = {
  carPrice?: string;
  moneyYouHave?: string;
  tradeInValue?: string;
  salesTaxPercent?: string;
  interestRatePercent?: string;
  termYears?: string;
  termMonths?: string;
  form?: string;
};

export function createDefaultInput(): CarLoanEmiInput {
  return {
    carPrice: '',
    carPriceCurrency: 'PKR',
    moneyYouHave: '0',
    moneyYouHaveCurrency: 'PKR',
    tradeInValue: '0',
    tradeInCurrency: 'PKR',
    salesTaxPercent: '0',
    loanAmountCurrency: 'PKR',
    interestRatePercent: '',
    termYears: '5',
    termMonths: '0',
    monthlyPaymentCurrency: 'PKR',
    totalInterestCurrency: 'PKR',
  };
}
