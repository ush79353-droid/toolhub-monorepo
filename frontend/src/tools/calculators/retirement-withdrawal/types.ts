import type { SupportedCurrency } from '@/tools/shared/currency';

export type SolveMode = 'withdrawal' | 'duration';

export type PaymentFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'semimonthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type CompoundingMethod =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily'
  | 'continuously';

export type WithdrawalTiming = 'beginning' | 'end';

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'semimonthly', label: 'Semimonthly', periodsPerYear: 24 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
] as const;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingMethod;
  label: string;
  periodsPerYear: number | null;
}[] = [
  { value: 'annually', label: 'Yearly', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'continuously', label: 'Continuously', periodsPerYear: null },
] as const;

export const TIMING_OPTIONS: readonly {
  value: WithdrawalTiming;
  label: string;
}[] = [
  { value: 'beginning', label: 'At the beginning of periods' },
  { value: 'end', label: 'At the end of periods' },
] as const;

export interface RetirementWithdrawalInput {
  mode: SolveMode;
  currency: SupportedCurrency;
  balanceAtRetirement: string;
  ageNow: string;
  retireAge: string;
  yearsInRetirement: string;
  /** Used when mode === 'duration' */
  withdrawalAmount: string;
  annualInterestRate: string;
  inflationBefore: string;
  inflationAfter: string;
  paymentFrequency: PaymentFrequency;
  compounding: CompoundingMethod;
  timing: WithdrawalTiming;
  endBalance: string;
}

export interface YearBalancePoint {
  calendarYear: number;
  age: number;
  balance: number;
}

export interface RetirementWithdrawalResult {
  mode: SolveMode;
  currency: SupportedCurrency;
  balanceAtRetirementEntered: number;
  /** After pre-retirement inflation adjustment */
  startingBalance: number;
  ageNow: number;
  retireAge: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  withdrawalAmount: number;
  endBalance: number;
  annualInterestRatePercent: number;
  inflationBeforePercent: number;
  inflationAfterPercent: number;
  paymentFrequency: PaymentFrequency;
  compounding: CompoundingMethod;
  timing: WithdrawalTiming;
  periodsPerYear: number;
  totalPeriods: number;
  periodRate: number;
  neverDepletes: boolean;
  depletedExactly: boolean;
  summaryMessage: string;
  frequencyLabel: string;
  timingPhrase: string;
  formattedWithdrawal: string;
  formattedStartingBalance: string;
  formattedEndBalance: string;
  formattedDuration: string;
  yearlyBalances: YearBalancePoint[];
  assumptionNotes: string[];
}

export type RetirementWithdrawalFieldErrors = Partial<
  Record<keyof RetirementWithdrawalInput, string>
>;

export function createDefaultInput(): RetirementWithdrawalInput {
  return {
    mode: 'withdrawal',
    currency: 'PKR',
    balanceAtRetirement: '100000',
    ageNow: '30',
    retireAge: '50',
    yearsInRetirement: '20',
    withdrawalAmount: '',
    annualInterestRate: '4',
    inflationBefore: '0',
    inflationAfter: '0',
    paymentFrequency: 'monthly',
    compounding: 'annually',
    timing: 'beginning',
    endBalance: '0',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): RetirementWithdrawalInput {
  return {
    mode: 'withdrawal',
    currency,
    balanceAtRetirement: '',
    ageNow: '',
    retireAge: '',
    yearsInRetirement: '',
    withdrawalAmount: '',
    annualInterestRate: '',
    inflationBefore: '',
    inflationAfter: '',
    paymentFrequency: 'monthly',
    compounding: 'annually',
    timing: 'beginning',
    endBalance: '',
  };
}
