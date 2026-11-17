import type { SupportedCurrency } from '@/tools/shared/currency';

export type Frequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type TermUnit = 'yrs' | 'mos';

export const FREQUENCY_OPTIONS: readonly {
  value: Frequency;
  label: string;
  periodsPerYear: number;
  paymentLabel: string;
}[] = [
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52, paymentLabel: 'Weekly payment' },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26, paymentLabel: 'Biweekly payment' },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12, paymentLabel: 'Monthly payment' },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4, paymentLabel: 'Quarterly payment' },
  {
    value: 'semiannually',
    label: 'Semiannually',
    periodsPerYear: 2,
    paymentLabel: 'Semiannual payment',
  },
  { value: 'annually', label: 'Annually', periodsPerYear: 1, paymentLabel: 'Annual payment' },
] as const;

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
] as const;

export interface LoanInterestInput {
  loanBalance: string;
  loanCurrency: SupportedCurrency;
  loanTerm: string;
  termUnit: TermUnit;
  interestRatePercent: string;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  interestCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
}

export interface ChartPoint {
  year: number;
  principalBalance: number;
  principalPaid: number;
  interestPaid: number;
}

export interface LoanInterestResult {
  loanBalance: number;
  periodicPayment: number;
  paymentCount: number;
  totalPayment: number;
  totalInterest: number;
  paymentLabel: string;
  paymentsPerYear: number;
  chartPoints: ChartPoint[];
  calcCurrency: SupportedCurrency;
  formattedInterest: string;
  formattedTotalPayment: string;
  formattedPeriodicPayment: string;
  interestDisplay: number;
  totalDisplay: number;
  paymentDisplay: number;
  loanCurrency: SupportedCurrency;
  interestCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
}

export type LoanInterestFieldErrors = {
  loanBalance?: string;
  loanTerm?: string;
  interestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): LoanInterestInput {
  return {
    loanBalance: '10000',
    loanCurrency: 'PKR',
    loanTerm: '10',
    termUnit: 'yrs',
    interestRatePercent: '4',
    paymentFrequency: 'monthly',
    compoundingFrequency: 'monthly',
    interestCurrency: 'PKR',
    totalCurrency: 'PKR',
    paymentCurrency: 'PKR',
  };
}
