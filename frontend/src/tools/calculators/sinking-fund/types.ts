import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

/** Existing supported compounding options (rate-of-return / savings-interest-rate). */
export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Yearly', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
];

export interface SinkingFundInput {
  moneyToAccumulate: string;
  annualInterestRatePercent: string;
  compounding: CompoundFrequency;
  periodYears: string;
  periodMonths: string;
  currency: SupportedCurrency;
}

export interface SinkingFundResult {
  ussfFactor: number;
  requiredContribution: number;
  periodsPerYear: number;
  totalPeriods: number;
  durationYears: number;
  ussfDisplay: string;
  contributionDisplay: string;
  currency: SupportedCurrency;
}

export type SinkingFundFieldErrors = Record<string, string>;

export function createDefaultInput(): SinkingFundInput {
  return {
    moneyToAccumulate: '',
    annualInterestRatePercent: '',
    compounding: 'annually',
    periodYears: '5',
    periodMonths: '0',
    currency: 'PKR',
  };
}

export function periodsPerYear(compounding: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 1;
}
