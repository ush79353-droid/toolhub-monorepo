import type { SupportedCurrency } from '@/tools/shared/currency';

export type FinanceMode = 'FV' | 'PMT' | 'IY' | 'N' | 'PV';

export type PaymentTiming = 'end' | 'beginning';

export type PaymentFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'semimonthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily'
  | 'continuously';

export const FINANCE_MODES: readonly { value: FinanceMode; label: string }[] = [
  { value: 'FV', label: 'FV' },
  { value: 'PMT', label: 'PMT' },
  { value: 'IY', label: 'I/Y' },
  { value: 'N', label: 'N' },
  { value: 'PV', label: 'PV' },
] as const;

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

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number | null;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'continuously', label: 'Continuously', periodsPerYear: null },
] as const;

export const PAYMENT_TIMING_OPTIONS: readonly {
  value: PaymentTiming;
  label: string;
}[] = [
  { value: 'end', label: 'End of period' },
  { value: 'beginning', label: 'Beginning of period' },
] as const;

export interface FinanceInput {
  mode: FinanceMode;
  n: string;
  iy: string;
  pv: string;
  pmt: string;
  fv: string;
  currency: SupportedCurrency;
  paymentFrequency: PaymentFrequency;
  compoundingFrequency: CompoundingFrequency;
  paymentTiming: PaymentTiming;
}

export interface FinanceScheduleRow {
  period: number;
  openingBalance: number;
  payment: number;
  interest: number;
  endingBalance: number;
}

export interface FinanceChartPoint {
  period: number;
  balance: number;
  sumOfPmt: number;
  accumulatedInterest: number;
}

export interface FinanceResult {
  mode: FinanceMode;
  n: number;
  iy: number;
  pv: number;
  pmt: number;
  fv: number;
  calculatedValue: number;
  totalPayments: number;
  totalInterest: number;
  paymentFrequency: PaymentFrequency;
  compoundingFrequency: CompoundingFrequency;
  paymentTiming: PaymentTiming;
  currency: SupportedCurrency;
  periodRate: number;
  schedule: FinanceScheduleRow[];
  chartPoints: FinanceChartPoint[];
  summaryText: string;
}

export type FinanceFieldErrors = {
  n?: string;
  iy?: string;
  pv?: string;
  pmt?: string;
  fv?: string;
  form?: string;
};

export function createDefaultInput(): FinanceInput {
  return {
    mode: 'FV',
    n: '10',
    iy: '6',
    pv: '20000',
    pmt: '-2000',
    fv: '0',
    currency: 'USD',
    paymentFrequency: 'annually',
    compoundingFrequency: 'annually',
    paymentTiming: 'end',
  };
}

export function createBlankInput(currency: SupportedCurrency = 'USD'): FinanceInput {
  return {
    mode: 'FV',
    n: '',
    iy: '',
    pv: '',
    pmt: '',
    fv: '',
    currency,
    paymentFrequency: 'annually',
    compoundingFrequency: 'annually',
    paymentTiming: 'end',
  };
}
