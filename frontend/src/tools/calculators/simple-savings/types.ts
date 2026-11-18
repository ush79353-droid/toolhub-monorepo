import type { SupportedCurrency } from '@/tools/shared/currency';

export type GoalMode = 'savings-balance';

export type KnownRateKind = 'interest-rate' | 'apy';

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

export interface SavingsDraft {
  goalMode: GoalMode;
  knownRate: KnownRateKind;
  initialSavings: string;
  initialCurrency: SupportedCurrency;
  ratePercent: string;
  termYears: string;
  termMonths: string;
  compounding: CompoundFrequency;
  adjustInflation: boolean;
  inflationPercent: string;
  depositGrowthPercent: string;
  depositAmount: string;
  depositCurrency: SupportedCurrency;
  depositFrequency: DepositFrequency;
  depositTiming: DepositTiming;
  resultCurrency: SupportedCurrency;
}

export interface SavingsResult {
  apyPercent: number;
  nominalRatePercent: number;
  finalBalance: number;
  totalAdditionalDeposits: number;
  totalPrincipal: number;
  totalInterest: number;
  /** Inflation-adjusted purchasing power of final balance; null when inflation off. */
  realFinalBalance: number | null;
  inflationPercent: number | null;
  years: number;
  compoundPeriodsPerYear: number;
  resultCurrency: SupportedCurrency;
  initialShare: number;
  depositsShare: number;
  interestShare: number;
}

export type SavingsFieldErrors = Partial<
  Record<
    | 'initialSavings'
    | 'ratePercent'
    | 'termYears'
    | 'termMonths'
    | 'depositAmount'
    | 'inflationPercent'
    | 'depositGrowthPercent'
    | 'form'
    | 'currency',
    string
  >
>;

export const GOAL_MODE_OPTIONS: readonly { value: GoalMode; label: string }[] = [
  { value: 'savings-balance', label: 'Savings balance' },
];

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
];

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
];

export const MONTH_OPTIONS: readonly number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
];

export function createDefaultDraft(): SavingsDraft {
  return {
    goalMode: 'savings-balance',
    knownRate: 'interest-rate',
    initialSavings: '1000',
    initialCurrency: 'PKR',
    ratePercent: '1.3',
    termYears: '6',
    termMonths: '0',
    compounding: 'monthly',
    adjustInflation: false,
    inflationPercent: '0',
    depositGrowthPercent: '0',
    depositAmount: '100',
    depositCurrency: 'PKR',
    depositFrequency: 'monthly',
    depositTiming: 'beginning',
    resultCurrency: 'PKR',
  };
}
