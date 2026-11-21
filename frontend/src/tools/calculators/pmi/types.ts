import type { SupportedCurrency } from '@/tools/shared/currency';

export type DownPaymentMode = 'amount' | 'percentage';

export type PmiApplicability =
  | 'mayBeRequired'
  | 'generallyNotRequired'
  | 'unknown';

export interface PmiInput {
  homePrice: string;
  downPaymentMode: DownPaymentMode;
  downPaymentAmount: string;
  downPaymentPercentage: string;
  annualPmiRate: string;
  currency: SupportedCurrency;
}

export interface PmiResult {
  homePrice: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  mortgageAmount: number;
  loanToValueRatio: number;
  annualPmiRate: number;
  annualPmi: number;
  monthlyPmi: number;
  applicability: PmiApplicability;
  currency: SupportedCurrency;
  formattedHomePrice: string;
  formattedDownPaymentAmount: string;
  formattedDownPaymentPercentage: string;
  formattedMortgageAmount: string;
  formattedLoanToValueRatio: string;
  formattedAnnualPmiRate: string;
  formattedAnnualPmi: string;
  formattedMonthlyPmi: string;
  applicabilityMessage: string;
}

export type PmiFieldErrors = {
  homePrice?: string;
  downPaymentAmount?: string;
  downPaymentPercentage?: string;
  annualPmiRate?: string;
  form?: string;
};

export function createDefaultInput(): PmiInput {
  return {
    homePrice: '',
    downPaymentMode: 'amount',
    downPaymentAmount: '',
    downPaymentPercentage: '',
    annualPmiRate: '',
    currency: 'PKR',
  };
}
