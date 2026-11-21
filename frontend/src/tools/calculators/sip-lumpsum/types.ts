import type { SupportedCurrency } from '@/tools/shared/currency';

/** Screenshot “I’d like to know the…” solve target. */
export type SipLumpsumSolveFor =
  | 'finalBalance'
  | 'deposit'
  | 'lumpsum'
  | 'return'
  | 'term';

export type TermUnit = 'yrs' | 'mos';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily'
  | 'continuously';

export type DepositFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type DepositTiming = 'beginning' | 'end';

export interface SipLumpsumInput {
  solveFor: SipLumpsumSolveFor;
  currency: SupportedCurrency;
  /** Used when solveFor !== 'lumpsum' */
  initialLumpsum: string;
  /** Used when solveFor !== 'return' */
  annualReturnPercent: string;
  /** Used when solveFor !== 'term' */
  termValue: string;
  termUnit: TermUnit;
  startDate: string;
  inflationPercent: string;
  compounding: CompoundFrequency;
  /** Used when solveFor !== 'deposit' */
  depositAmount: string;
  depositFrequency: DepositFrequency;
  depositTiming: DepositTiming;
  /**
   * Target final balance when solving for deposit / lumpsum / return / term.
   * Ignored when solveFor === 'finalBalance'.
   */
  targetFinalBalance: string;
}

export interface SipLumpsumScheduleRow {
  period: number;
  dateLabel: string;
  deposit: number;
  balance: number;
  interest: number;
}

export interface SipLumpsumResult {
  solveFor: SipLumpsumSolveFor;
  currency: SupportedCurrency;
  openingBalance: number;
  finalBalance: number;
  /** Inflation-adjusted purchasing power of final balance (null when inflation = 0). */
  realFinalBalance: number | null;
  periodicDeposit: number;
  totalDeposits: number;
  totalReturn: number;
  annualReturnPercent: number;
  termYears: number;
  depositPeriods: number;
  compoundPeriods: number;
  /** Screenshot “Number of transactions” — deposit periods over the term. */
  numberOfTransactions: number;
  endDateIso: string;
  endDateLabel: string;
  depositFrequency: DepositFrequency;
  depositTiming: DepositTiming;
  compounding: CompoundFrequency;
  inflationPercent: number;
  summaryMessage: string;
  formattedOpeningBalance: string;
  formattedFinalBalance: string;
  formattedRealFinalBalance: string | null;
  formattedPeriodicDeposit: string;
  formattedTotalDeposits: string;
  formattedTotalReturn: string;
  periodicInOutLabel: string;
  schedule: SipLumpsumScheduleRow[];
}

export type SipLumpsumFieldErrors = Partial<
  Record<
    | 'initialLumpsum'
    | 'annualReturnPercent'
    | 'termValue'
    | 'startDate'
    | 'inflationPercent'
    | 'depositAmount'
    | 'targetFinalBalance'
    | 'form',
    string
  >
>;

export const SOLVE_FOR_OPTIONS: readonly {
  value: SipLumpsumSolveFor;
  label: string;
}[] = [
  { value: 'finalBalance', label: 'final balance' },
  { value: 'deposit', label: 'periodic deposit' },
  { value: 'lumpsum', label: 'initial lumpsum' },
  { value: 'return', label: 'expected rate of return' },
  { value: 'term', label: 'term' },
] as const;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number | null;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'continuously', label: 'Continuously', periodsPerYear: null },
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

export const TIMING_OPTIONS: readonly {
  value: DepositTiming;
  label: string;
}[] = [
  { value: 'beginning', label: 'At the beginning of periods' },
  { value: 'end', label: 'At the end of periods' },
] as const;

/** Screenshot defaults: 1,000 PKR · 10% · 10 yrs · monthly · 0 deposit · begin. */
export function createDefaultInput(): SipLumpsumInput {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return {
    solveFor: 'finalBalance',
    currency: 'PKR',
    initialLumpsum: '1000',
    annualReturnPercent: '10',
    termValue: '10',
    termUnit: 'yrs',
    startDate: `${y}-${m}-${d}`,
    inflationPercent: '0',
    compounding: 'monthly',
    depositAmount: '0',
    depositFrequency: 'monthly',
    depositTiming: 'beginning',
    targetFinalBalance: '2707.04',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): SipLumpsumInput {
  return {
    solveFor: 'finalBalance',
    currency,
    initialLumpsum: '',
    annualReturnPercent: '',
    termValue: '',
    termUnit: 'yrs',
    startDate: '',
    inflationPercent: '',
    compounding: 'monthly',
    depositAmount: '',
    depositFrequency: 'monthly',
    depositTiming: 'beginning',
    targetFinalBalance: '',
  };
}
