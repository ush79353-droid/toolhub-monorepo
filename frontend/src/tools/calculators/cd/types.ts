import type { SupportedCurrency } from '@/tools/shared/currency';

export type CdCompounding =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'yearly';

export interface CdInput {
  initialDeposit: string;
  interestRate: string;
  termYears: string;
  termMonths: string;
  compounding: CdCompounding;
  currency: SupportedCurrency;
}

export interface CdResult {
  initialDeposit: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  years: number;
  compounding: CdCompounding;
  periodsPerYear: number;
  finalBalance: number;
  interestEarned: number;
  currency: SupportedCurrency;
  formattedFinalBalance: string;
  formattedInterestEarned: string;
}

export type CdFieldErrors = {
  initialDeposit?: string;
  interestRate?: string;
  termYears?: string;
  termMonths?: string;
  compounding?: string;
  form?: string;
};

export const CD_COMPOUNDING_OPTIONS: readonly {
  value: CdCompounding;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'yearly', label: 'Yearly', periodsPerYear: 1 },
] as const;

export function createDefaultInput(): CdInput {
  return {
    initialDeposit: '',
    interestRate: '',
    termYears: '',
    termMonths: '',
    compounding: 'yearly',
    currency: 'PKR',
  };
}
