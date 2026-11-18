import type { SupportedCurrency } from '@/tools/shared/currency';

export type PayoutMode = 'fixedPayment' | 'fixedLength';
export type AnnuityType = 'ordinary' | 'due';
export type PayoutFrequency =
  | 'yearly'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export const PAYOUT_MODE_OPTIONS: readonly { value: PayoutMode; label: string }[] = [
  { value: 'fixedPayment', label: 'Fixed payment annuity' },
  { value: 'fixedLength', label: 'Fixed length annuity' },
] as const;

export const ANNUITY_TYPE_OPTIONS: readonly { value: AnnuityType; label: string }[] = [
  { value: 'ordinary', label: 'Ordinary annuity' },
  { value: 'due', label: 'Annuity due' },
] as const;

export const PAYOUT_FREQUENCY_OPTIONS: readonly {
  value: PayoutFrequency;
  label: string;
  periodsPerYear: number;
  periodNoun: string;
}[] = [
  { value: 'yearly', label: 'Yearly', periodsPerYear: 1, periodNoun: 'year' },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2, periodNoun: 'half-year' },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4, periodNoun: 'quarter' },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12, periodNoun: 'month' },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26, periodNoun: 'biweek' },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52, periodNoun: 'week' },
  { value: 'daily', label: 'Daily', periodsPerYear: 365, periodNoun: 'day' },
] as const;

export interface AnnuityPayoutInput {
  mode: PayoutMode;
  initialBalance: string;
  initialBalanceCurrency: SupportedCurrency;
  payoutFrequency: PayoutFrequency;
  annuityType: AnnuityType;
  lengthYears: string;
  lengthMonths: string;
  /** Used in fixed-payment mode. */
  paymentAmount: string;
  paymentAmountCurrency: SupportedCurrency;
  annualRatePercent: string;
  setAdvanced: boolean;
  compoundingFrequency: PayoutFrequency;
  finalBalance: string;
  finalBalanceCurrency: SupportedCurrency;
  annualGrowthPercent: string;
}

export interface AnnuityPayoutResult {
  mode: PayoutMode;
  currency: SupportedCurrency;
  periodicPayment: number;
  paymentCount: number;
  durationYears: number;
  durationMonths: number;
  totalInterest: number;
  finalBalance: number;
  totalWithdrawn: number;
  payoutFrequency: PayoutFrequency;
  annuityType: AnnuityType;
  formattedPayment: string;
  formattedTotalInterest: string;
  formattedFinalBalance: string;
  summaryPrimary: string;
  summaryInterest: string;
}

export type AnnuityPayoutFieldErrors = {
  initialBalance?: string;
  paymentAmount?: string;
  lengthYears?: string;
  lengthMonths?: string;
  annualRatePercent?: string;
  finalBalance?: string;
  annualGrowthPercent?: string;
  form?: string;
};

export function createDefaultInput(): AnnuityPayoutInput {
  return {
    mode: 'fixedLength',
    initialBalance: '100000',
    initialBalanceCurrency: 'PKR',
    payoutFrequency: 'monthly',
    annuityType: 'ordinary',
    lengthYears: '10',
    lengthMonths: '0',
    paymentAmount: '1000',
    paymentAmountCurrency: 'PKR',
    annualRatePercent: '6',
    setAdvanced: false,
    compoundingFrequency: 'monthly',
    finalBalance: '0',
    finalBalanceCurrency: 'PKR',
    annualGrowthPercent: '0',
  };
}

export function periodsPerYear(frequency: PayoutFrequency): number {
  return (
    PAYOUT_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 12
  );
}

export function frequencyMeta(frequency: PayoutFrequency) {
  return (
    PAYOUT_FREQUENCY_OPTIONS.find((o) => o.value === frequency) ??
    PAYOUT_FREQUENCY_OPTIONS[3]
  );
}
