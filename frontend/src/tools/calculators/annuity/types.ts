import type { SupportedCurrency } from '@/tools/shared/currency';

export type SolveFor =
  | 'initialDeposit'
  | 'finalBalance'
  | 'annuityAmount'
  | 'timeLength'
  | 'rateOfReturn';

export type PaymentDirection = 'deposit' | 'withdrawal';
export type AnnuityType = 'due' | 'ordinary';
export type Frequency =
  | 'yearly'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';
export type TermUnit = 'yrs' | 'mos';
export type GrowthSource = 'annual' | 'periodic';

export const SOLVE_FOR_OPTIONS: readonly { value: SolveFor; label: string }[] = [
  { value: 'initialDeposit', label: 'Initial deposit' },
  { value: 'finalBalance', label: 'Final balance' },
  { value: 'annuityAmount', label: 'Annuity amount' },
  { value: 'timeLength', label: 'Time length' },
  { value: 'rateOfReturn', label: 'Rate of return' },
] as const;

export const DIRECTION_OPTIONS: readonly {
  value: PaymentDirection;
  label: string;
}[] = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
] as const;

export const FREQUENCY_OPTIONS: readonly {
  value: Frequency;
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
] as const;

export const ANNUITY_TYPE_OPTIONS: readonly {
  value: AnnuityType;
  label: string;
}[] = [
  { value: 'due', label: 'Annuity due' },
  { value: 'ordinary', label: 'Ordinary annuity' },
] as const;

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
] as const;

export interface AnnuityInput {
  solveFor: SolveFor;
  direction: PaymentDirection;
  paymentFrequency: Frequency;
  annuityType: AnnuityType;
  compoundingFrequency: Frequency;
  startDate: string;
  initialDeposit: string;
  initialDepositCurrency: SupportedCurrency;
  annuityAmount: string;
  annuityAmountCurrency: SupportedCurrency;
  length: string;
  lengthUnit: TermUnit;
  rateOfReturnPercent: string;
  annualGrowthPercent: string;
  periodicGrowthPercent: string;
  growthSource: GrowthSource;
  /** Target final balance when solving for PV / PMT / n / rate. */
  targetFinalBalance: string;
  targetFinalBalanceCurrency: SupportedCurrency;
}

export interface AnnuityResult {
  openingBalance: number;
  finalBalance: number;
  periodicPayment: number;
  totalPayments: number;
  totalReturn: number;
  numberOfPayments: number;
  lastPaymentDate: string;
  lastPaymentDateLabel: string;
  paymentFrequencyLabel: string;
  direction: PaymentDirection;
  solvedValue: number;
  solveFor: SolveFor;
  calcCurrency: SupportedCurrency;
  formattedOpeningBalance: string;
  formattedFinalBalance: string;
  formattedPeriodicPayment: string;
  formattedTotalPayments: string;
  formattedTotalReturn: string;
  summaryText: string;
}

export type AnnuityFieldErrors = {
  initialDeposit?: string;
  annuityAmount?: string;
  length?: string;
  rateOfReturnPercent?: string;
  annualGrowthPercent?: string;
  periodicGrowthPercent?: string;
  startDate?: string;
  targetFinalBalance?: string;
  form?: string;
};

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createDefaultInput(): AnnuityInput {
  return {
    solveFor: 'finalBalance',
    direction: 'deposit',
    paymentFrequency: 'monthly',
    annuityType: 'due',
    compoundingFrequency: 'monthly',
    startDate: todayIso(),
    initialDeposit: '0',
    initialDepositCurrency: 'PKR',
    annuityAmount: '1000',
    annuityAmountCurrency: 'PKR',
    length: '6',
    lengthUnit: 'yrs',
    rateOfReturnPercent: '5',
    annualGrowthPercent: '0',
    periodicGrowthPercent: '0',
    growthSource: 'annual',
    targetFinalBalance: '',
    targetFinalBalanceCurrency: 'PKR',
  };
}
