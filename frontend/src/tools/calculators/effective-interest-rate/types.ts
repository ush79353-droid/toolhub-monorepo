export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
] as const;

export interface EffectiveInterestRateInput {
  annualInterestRate: string;
  compounding: CompoundingFrequency;
}

export interface EffectiveInterestRateResult {
  annualInterestRatePercent: number;
  compounding: CompoundingFrequency;
  periodsPerYear: number;
  periodicRatePercent: number;
  eirPercent: number;
  formattedPeriodicRate: string;
  formattedEir: string;
}

export type EffectiveInterestRateFieldErrors = {
  annualInterestRate?: string;
  compounding?: string;
  form?: string;
};

export function createDefaultInput(): EffectiveInterestRateInput {
  return {
    annualInterestRate: '12',
    compounding: 'monthly',
  };
}

export function periodsPerYear(compounding: CompoundingFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12;
}
