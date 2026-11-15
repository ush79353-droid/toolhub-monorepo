import type { SupportedCurrency } from '@/tools/shared/currency';

export type DepositFrequency =
  | 'never'
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type DepositTiming = 'beginning' | 'end';

export interface ContinuousCompoundInterestInput {
  initialBalance: string;
  interestRate: string;
  termYears: string;
  termMonths: string;
  depositFrequency: DepositFrequency;
  depositAmount: string;
  depositTiming: DepositTiming;
  currency: SupportedCurrency;
}

export interface ContinuousCompoundInterestResult {
  initialBalance: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  years: number;
  depositFrequency: DepositFrequency;
  depositAmount: number;
  depositCount: number;
  totalDeposits: number;
  finalBalance: number;
  compoundInterest: number;
  currency: SupportedCurrency;
  formattedFinalBalance: string;
  formattedCompoundInterest: string;
}

export type ContinuousCompoundInterestFieldErrors = {
  initialBalance?: string;
  interestRate?: string;
  termYears?: string;
  termMonths?: string;
  depositAmount?: string;
  form?: string;
};

export const DEPOSIT_FREQUENCY_OPTIONS: readonly {
  value: DepositFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'never', label: 'Never', periodsPerYear: 0 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
] as const;

export function createDefaultInput(): ContinuousCompoundInterestInput {
  return {
    initialBalance: '1000',
    interestRate: '4',
    termYears: '20',
    termMonths: '0',
    depositFrequency: 'never',
    depositAmount: '',
    depositTiming: 'end',
    currency: 'PKR',
  };
}
