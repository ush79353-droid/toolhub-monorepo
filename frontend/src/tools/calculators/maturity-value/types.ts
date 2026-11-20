import type { SupportedCurrency } from '@/tools/shared/currency';

export type DurationUnit = 'years' | 'months';

export interface MaturityValueInput {
  principal: string;
  interestRate: string;
  duration: string;
  durationUnit: DurationUnit;
  currency: SupportedCurrency;
}

export interface MaturityValueResult {
  principal: number;
  annualInterestRatePercent: number;
  durationYears: number;
  maturityValue: number;
  interestEarned: number;
  currency: SupportedCurrency;
  formattedMaturityValue: string;
  formattedInterestEarned: string;
  warningMessage: string | null;
}

export type MaturityValueFieldErrors = {
  form?: string;
  principal?: string;
  interestRate?: string;
  duration?: string;
};

/** Reference: $2,000 · 3% · 2 years → $2,121.80 */
export function createDefaultInput(): MaturityValueInput {
  return {
    principal: '2000',
    interestRate: '3',
    duration: '2',
    durationUnit: 'years',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): MaturityValueInput {
  return {
    principal: '',
    interestRate: '',
    duration: '',
    durationUnit: 'years',
    currency,
  };
}
