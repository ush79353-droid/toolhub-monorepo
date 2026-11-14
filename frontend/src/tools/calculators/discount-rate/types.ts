import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly'
  | 'daily';

export type CashFlowFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'bi-weekly'
  | 'weekly';

export type CashFlowTiming = 'beginning' | 'end';
export type TermUnit = 'yrs' | 'mos';

export interface DiscountRateInput {
  presentValue: string;
  futureValue: string;
  term: string;
  termUnit: TermUnit;
  compoundFrequency: CompoundFrequency;
  cashFlow: string;
  cashFlowFrequency: CashFlowFrequency;
  cashFlowTiming: CashFlowTiming;
  currency: SupportedCurrency;
}

export interface DiscountRateResult {
  annualDiscountRatePercent: number;
  formattedRate: string;
  compoundsPerYear: number;
  termYears: number;
}

export type DiscountRateFieldErrors = {
  presentValue?: string;
  futureValue?: string;
  term?: string;
  cashFlow?: string;
  form?: string;
};

export const COMPOUND_OPTIONS: readonly { value: CompoundFrequency; label: string }[] = [
  { value: 'annually', label: 'Yearly (1/Yr)' },
  { value: 'semi-annually', label: 'Semi-annually (2/Yr)' },
  { value: 'quarterly', label: 'Quarterly (4/Yr)' },
  { value: 'monthly', label: 'Monthly (12/Yr)' },
  { value: 'bi-weekly', label: 'Bi-weekly (26/Yr)' },
  { value: 'weekly', label: 'Weekly (52/Yr)' },
  { value: 'daily', label: 'Daily (365/Yr)' },
];

export const CASH_FLOW_FREQUENCY_OPTIONS: readonly {
  value: CashFlowFrequency;
  label: string;
}[] = [
  { value: 'annually', label: 'Yearly' },
  { value: 'semi-annually', label: 'Semi-annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
];

export function createDefaultInput(): DiscountRateInput {
  return {
    presentValue: '',
    futureValue: '',
    term: '',
    termUnit: 'yrs',
    compoundFrequency: 'annually',
    cashFlow: '50',
    cashFlowFrequency: 'annually',
    cashFlowTiming: 'end',
    currency: 'PKR',
  };
}
