export type CompoundFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'daily';

export interface EarInput {
  annualInterestRate: string;
  compoundFrequency: CompoundFrequency;
}

export interface EarResult {
  periodicRatePercent: number;
  earPercent: number;
  compoundsPerYear: number;
  formattedPeriodicRate: string;
  formattedEar: string;
}

export type EarFieldErrors = {
  annualInterestRate?: string;
  form?: string;
};

export const COMPOUND_OPTIONS: readonly { value: CompoundFrequency; label: string }[] = [
  { value: 'annually', label: 'Annual' },
  { value: 'semi-annually', label: 'Semiannual' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
];

export function createDefaultInput(): EarInput {
  return {
    annualInterestRate: '',
    compoundFrequency: 'annually',
  };
}
