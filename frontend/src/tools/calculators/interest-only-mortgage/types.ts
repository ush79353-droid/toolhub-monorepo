import type { SupportedCurrency } from '@/tools/shared/currency';

export type PaymentFrequency = 'daily' | 'monthly' | 'quarterly' | 'yearly';

export interface InterestOnlyMortgageInput {
  loanAmount: string;
  annualInterestRatePercent: string;
  paymentFrequency: PaymentFrequency;
  /** Currency of the loan amount (calculation currency). */
  currency: SupportedCurrency;
  /** Independent display currency for the periodic payment. */
  resultCurrency: SupportedCurrency;
  /** Interest-only period length (years part). */
  periodYears: string;
  /** Interest-only period length (months part). */
  periodMonths: string;
  /** Independent display currency for total interest paid over the IO period. */
  totalCurrency: SupportedCurrency;
}

export interface InterestOnlyMortgageResult {
  periodicPaymentInLoan: number;
  periodicPayment: number;
  paymentLabel: string;
  formattedPeriodicPayment: string;
  totalInterestInLoan: number | null;
  totalInterest: number | null;
  formattedTotalInterest: string | null;
  periodYearsTotal: number | null;
  remainingPrincipal: number;
  currency: SupportedCurrency;
  loanCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
}

export type InterestOnlyMortgageFieldErrors = {
  loanAmount?: string;
  annualInterestRatePercent?: string;
  paymentFrequency?: string;
  periodYears?: string;
  periodMonths?: string;
  form?: string;
};

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  paymentLabel: string;
  periodsPerYear: number;
}[] = [
  { value: 'daily', label: 'Daily', paymentLabel: 'Daily payment', periodsPerYear: 365 },
  { value: 'monthly', label: 'Monthly', paymentLabel: 'Monthly payment', periodsPerYear: 12 },
  {
    value: 'quarterly',
    label: 'Quarterly',
    paymentLabel: 'Quarterly payment',
    periodsPerYear: 4,
  },
  { value: 'yearly', label: 'Yearly', paymentLabel: 'Yearly payment', periodsPerYear: 1 },
] as const;

export function createDefaultInput(): InterestOnlyMortgageInput {
  return {
    loanAmount: '',
    annualInterestRatePercent: '',
    paymentFrequency: 'monthly',
    currency: 'PKR',
    resultCurrency: 'PKR',
    periodYears: '',
    periodMonths: '',
    totalCurrency: 'PKR',
  };
}
