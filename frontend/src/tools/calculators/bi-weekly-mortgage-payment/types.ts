import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundingFrequency = 'monthly_uk_us' | 'semi_annual_canada';

export type TermUnit = 'yrs' | 'mos';

/** Baseline column in the comparison table (screenshot default). */
export type ComparisonWith = 'monthly';

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'monthly_uk_us', label: 'Monthly (UK & US)' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
];

export const COMPARISON_WITH_OPTIONS: readonly {
  value: ComparisonWith;
  label: string;
}[] = [{ value: 'monthly', label: 'Monthly payments' }];

export interface BiWeeklyMortgagePaymentInput {
  mortgageAmount: string;
  mortgageCurrency: SupportedCurrency;
  mortgageTerm: string;
  termUnit: TermUnit;
  interestRatePercent: string;
  extraPayment: string;
  extraPaymentCurrency: SupportedCurrency;
  changePointsFeesCompounding: boolean;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: string;
  upfrontFee: string;
  upfrontFeeCurrency: SupportedCurrency;
  comparisonWith: ComparisonWith;
}

export interface ScheduleColumn {
  label: string;
  periodicPayment: number;
  paymentCount: number;
  termYears: number;
  termMonths: number;
  payoffDate: string;
  totalInterest: number;
  /** Schedule cash + closing costs. */
  totalPayments: number;
  formattedPayment: string;
  formattedTerm: string;
  formattedPayoffDate: string;
  formattedTotalInterest: string;
  formattedTotalPayments: string;
}

export interface BiWeeklyMortgagePaymentResult {
  calcCurrency: SupportedCurrency;
  monthly: ScheduleColumn;
  biweekly: ScheduleColumn;
}

export type BiWeeklyMortgagePaymentFieldErrors = {
  mortgageAmount?: string;
  mortgageTerm?: string;
  interestRatePercent?: string;
  mortgagePointsPercent?: string;
  upfrontFee?: string;
  extraPayment?: string;
  form?: string;
};

export function createDefaultInput(): BiWeeklyMortgagePaymentInput {
  return {
    mortgageAmount: '300000',
    mortgageCurrency: 'PKR',
    mortgageTerm: '30',
    termUnit: 'yrs',
    interestRatePercent: '7.5',
    extraPayment: '0',
    extraPaymentCurrency: 'PKR',
    changePointsFeesCompounding: false,
    compounding: 'monthly_uk_us',
    mortgagePointsPercent: '0',
    upfrontFee: '0',
    upfrontFeeCurrency: 'PKR',
    comparisonWith: 'monthly',
  };
}
