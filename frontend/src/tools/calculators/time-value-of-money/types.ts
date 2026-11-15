import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundFrequency =
  | 'yearly'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type MoneySourceField = 'presentValue' | 'futureValue';

export interface TimeValueOfMoneyInput {
  interestRatePercent: string;
  years: string;
  months: string;
  compounding: CompoundFrequency;
  presentValue: string;
  futureValue: string;
  sourceField: MoneySourceField;
  currency: SupportedCurrency;
}

export interface TimeValueOfMoneyResult {
  interestRatePercent: number;
  years: number;
  months: number;
  termYears: number;
  compounding: CompoundFrequency;
  compoundsPerYear: number;
  presentValue: number;
  futureValue: number;
  sourceField: MoneySourceField;
  currency: SupportedCurrency;
  formattedPresentValue: string;
  formattedFutureValue: string;
}

export type TimeValueOfMoneyFieldErrors = {
  interestRatePercent?: string;
  years?: string;
  months?: string;
  presentValue?: string;
  futureValue?: string;
  form?: string;
};

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'yearly', label: 'Yearly', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
];

export function createDefaultInput(): TimeValueOfMoneyInput {
  return {
    interestRatePercent: '10',
    years: '2',
    months: '0',
    compounding: 'yearly',
    presentValue: '10000',
    futureValue: '',
    sourceField: 'presentValue',
    currency: 'PKR',
  };
}
