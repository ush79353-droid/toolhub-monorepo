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
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type DepositTiming = 'beginning' | 'end';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
] as const;

export const DEPOSIT_FREQUENCY_OPTIONS: readonly {
  value: DepositFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
] as const;

export interface SavingsInterestRateInput {
  savingsGoal: string;
  initialBalance: string;
  termYears: string;
  compounding: CompoundFrequency;
  depositAmount: string;
  depositFrequency: DepositFrequency;
  depositTiming: DepositTiming;
  currency: SupportedCurrency;
}

export interface AnnualBalancePoint {
  year: number;
  principal: number;
  interest: number;
  totalBalance: number;
}

export interface SavingsInterestRateResult {
  requiredRatePercent: number;
  totalDeposited: number;
  finalBalance: number;
  years: number;
  annualPoints: AnnualBalancePoint[];
  currency: SupportedCurrency;
  alreadyReachableAtZero: boolean;
  explanation: string | null;
  formattedRequiredRate: string;
  formattedTotalDeposited: string;
  formattedFinalBalance: string;
}

export type SavingsInterestRateFieldErrors = Partial<
  Record<
    'savingsGoal' | 'initialBalance' | 'termYears' | 'depositAmount' | 'form',
    string
  >
>;

export function createDefaultInput(): SavingsInterestRateInput {
  return {
    savingsGoal: '100000',
    initialBalance: '0',
    termYears: '30',
    compounding: 'monthly',
    depositAmount: '100',
    depositFrequency: 'monthly',
    depositTiming: 'end',
    currency: 'PKR',
  };
}
