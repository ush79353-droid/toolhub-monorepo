import type { SupportedCurrency } from '@/tools/shared/currency';

export type CdCompounding =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type CdRateConvention = 'nominal' | 'apy';

export type CdScheduleView = 'annual' | 'monthly';

export interface CdInput {
  initialDeposit: string;
  interestRate: string;
  rateConvention: CdRateConvention;
  compounding: CdCompounding;
  depositYears: string;
  depositMonths: string;
  marginalTaxRate: string;
  currency: SupportedCurrency;
  scheduleView: CdScheduleView;
}

export interface CdScheduleEntry {
  period: number;
  label: string;
  deposit: number;
  interest: number;
  endingBalance: number;
  principal: number;
  accumulatedInterest: number;
}

export interface CdResult {
  initialDeposit: number;
  interestRatePercent: number;
  rateConvention: CdRateConvention;
  compounding: CdCompounding;
  periodsPerYear: number;
  depositYears: number;
  depositMonths: number;
  durationYears: number;
  durationLabel: string;
  nominalRatePercent: number;
  effectiveApyPercent: number;
  grossFinalBalance: number;
  grossInterest: number;
  estimatedTax: number;
  netInterest: number;
  afterTaxBalance: number;
  principalSharePercent: number;
  interestSharePercent: number;
  annualSchedule: CdScheduleEntry[];
  monthlySchedule: CdScheduleEntry[];
  currency: SupportedCurrency;
}

export type CdFieldErrors = Partial<
  Record<
    | 'initialDeposit'
    | 'interestRate'
    | 'depositYears'
    | 'depositMonths'
    | 'marginalTaxRate'
    | 'compounding'
    | 'form',
    string
  >
>;

export const CD_COMPOUNDING_OPTIONS: readonly {
  value: CdCompounding;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
] as const;

export const CD_RATE_CONVENTION_OPTIONS: readonly {
  value: CdRateConvention;
  label: string;
}[] = [
  { value: 'nominal', label: 'Nominal APR' },
  { value: 'apy', label: 'APY' },
] as const;

export function createDefaultInput(): CdInput {
  return {
    initialDeposit: '',
    interestRate: '',
    rateConvention: 'nominal',
    compounding: 'annually',
    depositYears: '',
    depositMonths: '',
    marginalTaxRate: '0',
    currency: 'USD',
    scheduleView: 'annual',
  };
}

export function createExampleInput(): CdInput {
  return {
    initialDeposit: '10000',
    interestRate: '5',
    rateConvention: 'nominal',
    compounding: 'annually',
    depositYears: '3',
    depositMonths: '0',
    marginalTaxRate: '0',
    currency: 'USD',
    scheduleView: 'annual',
  };
}
