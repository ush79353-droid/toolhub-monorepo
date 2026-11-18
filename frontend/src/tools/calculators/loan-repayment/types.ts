import type { SupportedCurrency } from '@/tools/shared/currency';

export type PaymentType = 'even_total' | 'even_principal' | 'balloon';

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

export const PAYMENT_TYPE_OPTIONS: readonly {
  value: PaymentType;
  label: string;
}[] = [
  { value: 'even_total', label: 'Even total payments' },
  { value: 'even_principal', label: 'Even principal payments' },
  { value: 'balloon', label: 'Balloon payment' },
] as const;

export interface LoanRepaymentInput {
  paymentType: PaymentType;
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  termYears: string;
  termMonths: string;
  interestRatePercent: string;
  compoundingFrequency: CompoundingFrequency;
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

export interface LoanRepaymentResult {
  currency: SupportedCurrency;
  paymentType: PaymentType;
  hasExtraPayments: boolean;
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

export type LoanRepaymentFieldErrors = {
  loanAmount?: string;
  termYears?: string;
  termMonths?: string;
  interestRatePercent?: string;
  extraMonthlyPayment?: string;
  form?: string;
};

export function createDefaultInput(): LoanRepaymentInput {
  return {
    paymentType: 'even_total',
    loanAmount: '10000',
    loanCurrency: 'PKR',
    termYears: '10',
    termMonths: '0',
    interestRatePercent: '7.5',
    compoundingFrequency: 'monthly',
    extraMonthlyPayment: '0',
    extraPaymentCurrency: 'PKR',
  };
}
