import type { SupportedCurrency } from '@/tools/shared/currency';

export type PeriodicTiming = 'end' | 'beginning';

export interface FutureValueInput {
  presentValue: string;
  periods: string;
  interestRatePercent: string;
  includePeriodic: boolean;
  periodicAmount: string;
  periodicTiming: PeriodicTiming;
  showSchedule: boolean;
  showBreakdown: boolean;
  showAmountByPeriod: boolean;
  currency: SupportedCurrency;
}

export interface FutureValueScheduleRow {
  period: number;
  startBalance: number;
  interest: number;
  contribution: number;
  endBalance: number;
  formattedStartBalance: string;
  formattedInterest: string;
  formattedContribution: string;
  formattedEndBalance: string;
}

export interface FutureValueResult {
  presentValue: number;
  periods: number;
  interestRatePercent: number;
  includePeriodic: boolean;
  periodicAmount: number;
  periodicTiming: PeriodicTiming;
  netContributions: number;
  futureValue: number;
  totalInterest: number;
  currency: SupportedCurrency;
  schedule: FutureValueScheduleRow[];
  formattedPresentValueGrowth: string;
  formattedContributionsGrowth: string;
  formattedFutureValue: string;
  formattedTotalInterest: string;
  formattedNetContributions: string;
  amountByPeriod: readonly { period: number; amount: number; formattedAmount: string }[];
}

export type FutureValueFieldErrors = {
  presentValue?: string;
  periods?: string;
  interestRatePercent?: string;
  periodicAmount?: string;
  form?: string;
};

export function createDefaultInput(): FutureValueInput {
  return {
    presentValue: '',
    periods: '',
    interestRatePercent: '',
    includePeriodic: false,
    periodicAmount: '',
    periodicTiming: 'end',
    showSchedule: false,
    showBreakdown: false,
    showAmountByPeriod: false,
    currency: 'PKR',
  };
}
