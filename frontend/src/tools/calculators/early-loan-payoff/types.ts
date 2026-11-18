import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundingFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
] as const;

export interface EarlyLoanPayoffInput {
  loanBalance: string;
  loanCurrency: SupportedCurrency;
  useDecreasingPayments: boolean;
  termYears: string;
  termMonths: string;
  interestRatePercent: string;
  compoundingFrequency: CompoundingFrequency;
  balloonPayments: boolean;
  extraMonthlyPayment: string;
  extraPaymentCurrency: SupportedCurrency;
}

export interface ScheduleRow {
  period: number;
  openingBalance: number;
  scheduledPayment: number;
  principalPaid: number;
  interestPaid: number;
  extraPayment: number;
  totalPayment: number;
  closingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface YearlyRow {
  year: number;
  yearlyPayment: number;
  yearlyPrincipal: number;
  yearlyInterest: number;
}

export interface ChartPoint {
  /** Elapsed years (period / 12). */
  year: number;
  period: number;
  principalBalance: number;
  principalPaid: number;
  interestPaid: number;
}

export interface EarlyLoanPayoffResult {
  currency: SupportedCurrency;
  hasExtraPayments: boolean;
  useDecreasingPayments: boolean;
  monthlyRepayment: number;
  formattedMonthlyRepayment: string;
  totalRepayment: number;
  formattedTotalRepayment: string;
  totalInterest: number;
  formattedTotalInterest: string;
  scheduledPayments: number;
  actualPayments: number;
  monthsSaved: number;
  interestSavings: number;
  formattedInterestSavings: string;
  baselineTotalInterest: number;
  baselineTotalRepayment: number;
  baselineMonthlyRepayment: number;
  formattedBaselineMonthlyRepayment: string;
  timeSavedLabel: string;
  schedule: ScheduleRow[];
  yearlyRows: YearlyRow[];
  chartPoints: ChartPoint[];
}

export type EarlyLoanPayoffFieldErrors = {
  loanBalance?: string;
  termYears?: string;
  termMonths?: string;
  interestRatePercent?: string;
  extraMonthlyPayment?: string;
  form?: string;
};

export function createDefaultInput(): EarlyLoanPayoffInput {
  return {
    loanBalance: '10000',
    loanCurrency: 'PKR',
    useDecreasingPayments: false,
    termYears: '10',
    termMonths: '0',
    interestRatePercent: '7.5',
    compoundingFrequency: 'monthly',
    balloonPayments: false,
    extraMonthlyPayment: '0',
    extraPaymentCurrency: 'PKR',
  };
}
