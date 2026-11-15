import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually (1/Yr)', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually (2/Yr)', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly (4/Yr)', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly (12/Yr)', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly (26/Yr)', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly (52/Yr)', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily (365/Yr)', periodsPerYear: 365 },
] as const;

export interface CompoundInterestRateInput {
  initialBalance: number;
  finalBalance: number;
  compounding: CompoundingFrequency;
  termYears: number;
  termMonths: number;
  currency: SupportedCurrency;
}

export interface CompoundInterestRateResult {
  defined: boolean;
  explanation: string | null;
  initialBalance: number;
  finalBalance: number;
  surplus: number;
  compounding: CompoundingFrequency;
  periodsPerYear: number;
  termYears: number;
  termMonths: number;
  termYearsExact: number;
  annualNominalRatePercent: number | null;
  currency: SupportedCurrency;
}

export type CompoundInterestRateFieldErrors = Record<string, string>;

export function createDefaultCompoundInterestRateInput(): CompoundInterestRateInput {
  return {
    initialBalance: 10_000,
    finalBalance: 18_000,
    compounding: 'monthly',
    termYears: 10,
    termMonths: 0,
    currency: 'PKR',
  };
}

export function periodsPerYear(compounding: CompoundingFrequency): number {
  return (
    COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12
  );
}
