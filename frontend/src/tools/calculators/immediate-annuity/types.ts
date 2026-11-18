import type { SupportedCurrency } from '@/tools/shared/currency';
import type { AnnuityType, Frequency, TermUnit } from '../annuity/types';

export type { AnnuityType, Frequency, TermUnit };

/** What the user wants to solve for (screenshot radio list). */
export type ImmediateMode =
  | 'withdraw'
  | 'invest'
  | 'duration'
  | 'rate'
  | 'remain';

export const IMMEDIATE_MODE_OPTIONS: readonly {
  value: ImmediateMode;
  label: string;
}[] = [
  { value: 'withdraw', label: 'How much can I withdraw?' },
  { value: 'invest', label: 'How much money should I invest?' },
  { value: 'duration', label: 'How long can I withdraw for?' },
  { value: 'rate', label: 'What rate of return is needed?' },
  { value: 'remain', label: 'How much money will remain?' },
] as const;

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: Frequency;
  label: string;
}[] = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'semiannually', label: 'Semiannually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
] as const;

export const TIMING_OPTIONS: readonly {
  value: AnnuityType;
  label: string;
}[] = [
  { value: 'due', label: 'Beginning of periods' },
  { value: 'ordinary', label: 'End of periods' },
] as const;

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'years' },
  { value: 'mos', label: 'months' },
] as const;

export interface ImmediateAnnuityInput {
  mode: ImmediateMode;
  paymentFrequency: Frequency;
  annuityType: AnnuityType;
  startDate: string;
  changeCompounding: boolean;
  compoundingFrequency: Frequency;
  amountToInvest: string;
  amountToInvestCurrency: SupportedCurrency;
  withdrawalAmount: string;
  withdrawalAmountCurrency: SupportedCurrency;
  length: string;
  lengthUnit: TermUnit;
  rateOfReturnPercent: string;
  displayMore: boolean;
  remainingBalance: string;
  remainingBalanceCurrency: SupportedCurrency;
  annualGrowthPercent: string;
}

export interface YearlyScheduleRow {
  year: number;
  openingBalance: number;
  yearlyWithdraw: number;
  yearlyReturn: number;
  closingBalance: number;
  formattedOpeningBalance: string;
  formattedYearlyWithdraw: string;
  formattedYearlyReturn: string;
  formattedClosingBalance: string;
}

export interface ImmediateAnnuityResult {
  mode: ImmediateMode;
  currency: SupportedCurrency;
  openingBalance: number;
  finalBalance: number;
  periodicWithdrawal: number;
  totalWithdrawals: number;
  totalReturn: number;
  numberOfWithdrawals: number;
  lastWithdrawalDate: string;
  lastWithdrawalDateLabel: string;
  paymentFrequencyLabel: string;
  timingLabel: string;
  lengthYears: number;
  rateOfReturnPercent: number;
  formattedOpeningBalance: string;
  formattedFinalBalance: string;
  formattedPeriodicWithdrawal: string;
  formattedTotalWithdrawals: string;
  formattedTotalReturn: string;
  summaryText: string;
  yearlySchedule: YearlyScheduleRow[];
}

export type ImmediateAnnuityFieldErrors = {
  amountToInvest?: string;
  withdrawalAmount?: string;
  length?: string;
  rateOfReturnPercent?: string;
  startDate?: string;
  remainingBalance?: string;
  annualGrowthPercent?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): ImmediateAnnuityInput {
  return {
    mode: 'withdraw',
    paymentFrequency: 'monthly',
    annuityType: 'due',
    startDate: todayIsoDate(),
    changeCompounding: false,
    compoundingFrequency: 'monthly',
    amountToInvest: '100000',
    amountToInvestCurrency: 'PKR',
    withdrawalAmount: '1000',
    withdrawalAmountCurrency: 'PKR',
    length: '10',
    lengthUnit: 'yrs',
    rateOfReturnPercent: '1.5',
    displayMore: false,
    remainingBalance: '0',
    remainingBalanceCurrency: 'PKR',
    annualGrowthPercent: '0',
  };
}
