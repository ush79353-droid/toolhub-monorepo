import type { SupportedCurrency } from '@/tools/shared/currency';

export type AnnuityKind = 'ordinary' | 'due';
export type TermUnit = 'yrs' | 'mos';

export type PaymentFrequency =
  | 'yearly'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type CompoundingFrequency = PaymentFrequency | 'continuous';

export const PAYMENT_FREQUENCY_OPTIONS = [
  { value: 'yearly' as const, label: 'Yearly', periodsPerYear: 1 },
  { value: 'semiannually' as const, label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly' as const, label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly' as const, label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly' as const, label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly' as const, label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily' as const, label: 'Daily', periodsPerYear: 365 },
] as const;

export const COMPOUNDING_FREQUENCY_OPTIONS = [
  ...PAYMENT_FREQUENCY_OPTIONS,
  { value: 'continuous' as const, label: 'Continuous', periodsPerYear: Number.POSITIVE_INFINITY },
] as const;

export const TERM_UNIT_OPTIONS = [
  { value: 'yrs' as const, label: 'yrs' },
  { value: 'mos' as const, label: 'mos' },
] as const;

export const ANNUITY_KIND_OPTIONS = [
  { value: 'ordinary' as const, label: 'Ordinary annuity' },
  { value: 'due' as const, label: 'Annuity due' },
] as const;

export interface PresentValueOfAnnuityInput {
  paymentAmount: string;
  paymentCurrency: SupportedCurrency;
  interestRatePercent: string;
  termLength: string;
  termUnit: TermUnit;
  compoundingFrequency: CompoundingFrequency;
  paymentFrequency: PaymentFrequency;
  annuityKind: AnnuityKind;
  /** Advanced: payment growth rate per payment period (%). */
  growthRatePercent: string;
  resultCurrency: SupportedCurrency;
}

export interface PresentValueOfAnnuityResult {
  presentValue: number;
  presentValueInPayment: number;
  paymentCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
  numberOfPeriods: number;
  termYears: number;
  periodicRatePercent: number;
  equivalentInterestRatePercent: number;
  formattedPresentValue: string;
  formattedNumberOfPeriods: string;
  formattedTermYears: string;
  formattedPeriodicRate: string;
  formattedEquivalentRate: string;
}

export type PresentValueOfAnnuityFieldErrors = {
  paymentAmount?: string;
  interestRatePercent?: string;
  termLength?: string;
  growthRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): PresentValueOfAnnuityInput {
  return {
    paymentAmount: '100',
    paymentCurrency: 'PKR',
    interestRatePercent: '5',
    termLength: '3',
    termUnit: 'yrs',
    compoundingFrequency: 'yearly',
    paymentFrequency: 'yearly',
    annuityKind: 'ordinary',
    growthRatePercent: '0',
    resultCurrency: 'PKR',
  };
}
