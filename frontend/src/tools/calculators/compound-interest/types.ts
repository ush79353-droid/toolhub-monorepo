import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type DepositFrequency =
  | 'never'
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type DepositTiming = 'beginning' | 'end';

export type BalanceView = 'bar' | 'pie' | 'table' | 'charts-table';

export interface CompoundInterestDraft {
  initialBalance: string;
  interestRate: string;
  termYears: string;
  termMonths: string;
  compounding: CompoundFrequency;
  depositFrequency: DepositFrequency;
  depositAmount: string;
  depositTiming: DepositTiming;
  currency: SupportedCurrency;
  balanceView: BalanceView;
}

export interface YearBalanceRow {
  year: number;
  yearlyCompBalance: number;
  selectedCompBalance: number;
  additionalInterest: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalCompoundInterest: number;
  totalPrincipalContributed: number;
  initialBalance: number;
  totalDeposits: number;
  years: number;
  periodsPerYear: number;
  yearlyRows: YearBalanceRow[];
  formattedFinalBalance: string;
  formattedInterest: string;
  formattedPrincipal: string;
}

export type CompoundInterestFieldErrors = Partial<
  Record<
    | 'initialBalance'
    | 'interestRate'
    | 'termYears'
    | 'termMonths'
    | 'depositAmount'
    | 'form',
    string
  >
>;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
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
];

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
];

export function createDefaultDraft(): CompoundInterestDraft {
  return {
    initialBalance: '1000',
    interestRate: '8',
    termYears: '20',
    termMonths: '0',
    compounding: 'monthly',
    depositFrequency: 'never',
    depositAmount: '',
    depositTiming: 'end',
    currency: 'PKR',
    balanceView: 'bar',
  };
}
