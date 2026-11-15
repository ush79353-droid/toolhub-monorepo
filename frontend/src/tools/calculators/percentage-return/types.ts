import type { SupportedCurrency } from '@/tools/shared/currency';

export type SolveMode = 'annualized' | 'time-needed';
export type DurationSource = 'endDate' | 'duration';

export interface PercentageReturnInput {
  investedAmount: string;
  returnedAmount: string;
  currency: SupportedCurrency;
  solveMode: SolveMode;
  startDate: string;
  endDate: string;
  durationYears: string;
  annualizedRatePercent: string;
  durationSource: DurationSource;
  compareEnabled: boolean;
}

export interface PercentageReturnResult {
  gainOrLoss: number | null;
  percentageReturn: number | null;
  annualizedReturn: number | null;
  timeNeededYears: number | null;
  gainOrLossDisplay: string;
  percentageReturnDisplay: string;
  annualizedReturnDisplay: string;
  timeNeededDisplay: string;
  currency: SupportedCurrency;
}

export type PercentageReturnFieldErrors = Record<string, string>;

/** Screenshot default start date: 11/15/2026 */
export const DEFAULT_START_DATE = '2026-11-15';

export function createDefaultInput(): PercentageReturnInput {
  return {
    investedAmount: '',
    returnedAmount: '',
    currency: 'PKR',
    solveMode: 'annualized',
    startDate: DEFAULT_START_DATE,
    endDate: '',
    durationYears: '',
    annualizedRatePercent: '',
    durationSource: 'endDate',
    compareEnabled: false,
  };
}
