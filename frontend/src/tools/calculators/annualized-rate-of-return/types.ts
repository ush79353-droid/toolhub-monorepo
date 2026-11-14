export type PeriodFrequency = 'annual' | 'quarterly' | 'monthly' | 'weekly' | 'daily';

export const PERIOD_OPTIONS: readonly { value: PeriodFrequency; label: string; n: number }[] = [
  { value: 'annual', label: 'Annual', n: 1 },
  { value: 'quarterly', label: 'Quarterly', n: 4 },
  { value: 'monthly', label: 'Monthly', n: 12 },
  { value: 'weekly', label: 'Weekly', n: 52 },
  { value: 'daily', label: 'Daily', n: 365 },
] as const;

export interface AnnualizedRateOfReturnInput {
  period: PeriodFrequency;
  periodRate: string;
}

export interface AnnualizedRateOfReturnResult {
  annualizedReturnPercent: number;
  formattedRate: string;
  periodsPerYear: number;
}

export type AnnualizedRateOfReturnFieldErrors = {
  periodRate?: string;
  general?: string;
};
