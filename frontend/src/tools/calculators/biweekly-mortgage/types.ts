import type { SupportedCurrency } from '@/tools/shared/currency';

/** Compounding conventions confirmed by the reference (Omni-style UK/US vs Canada). */
export type CompoundingFrequency = 'monthly_uk_us' | 'semi_annual_canada';

export type TermUnit = 'yrs' | 'mos';

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'monthly_uk_us', label: 'Monthly (UK & US)' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
];

export interface BiweeklyMortgageInput {
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  mortgageTerm: string;
  termUnit: TermUnit;
  interestRatePercent: string;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: string;
  upfrontFee: string;
  upfrontFeeCurrency: SupportedCurrency;
  extraPayment: string;
  extraPaymentCurrency: SupportedCurrency;
}

export interface ScheduleSummary {
  periodicPayment: number;
  paymentCount: number;
  totalInterest: number;
  /** Principal + interest + closing costs (points + upfront), no double-count. */
  totalPayment: number;
  termYears: number;
  termMonths: number;
  formattedPeriodicPayment: string;
  formattedTotalInterest: string;
  formattedTotalPayment: string;
  formattedTerm: string;
}

export interface BiweeklyMortgageResult {
  currency: SupportedCurrency;
  closingCosts: number;
  withoutAcceleration: ScheduleSummary;
  biweekly: ScheduleSummary;
  /** Monthly-equivalent cash-flow increase: biweekly×26/12 − monthly. */
  paymentDifference: number;
  termSavedYears: number;
  termSavedMonths: number;
  interestSaved: number;
  totalPaymentSaved: number;
  formattedPaymentDifference: string;
  formattedTermSaved: string;
  formattedInterestSaved: string;
  formattedTotalPaymentSaved: string;
}

export type BiweeklyMortgageFieldErrors = {
  loanAmount?: string;
  mortgageTerm?: string;
  interestRatePercent?: string;
  mortgagePointsPercent?: string;
  upfrontFee?: string;
  extraPayment?: string;
  form?: string;
};

export function createDefaultInput(): BiweeklyMortgageInput {
  return {
    loanAmount: '150000',
    loanCurrency: 'PKR',
    mortgageTerm: '30',
    termUnit: 'yrs',
    interestRatePercent: '6',
    compounding: 'monthly_uk_us',
    mortgagePointsPercent: '0',
    upfrontFee: '0',
    upfrontFeeCurrency: 'PKR',
    extraPayment: '0',
    extraPaymentCurrency: 'PKR',
  };
}
