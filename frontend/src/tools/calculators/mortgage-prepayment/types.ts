import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni-style compounding on the screenshot. */
export type InterestMethod = 'monthly_us_uk' | 'semi_annual_canada';

export type PaymentFrequency =
  | 'monthly'
  | 'semi_monthly'
  | 'biweekly'
  | 'weekly';

export type TermUnit = 'yrs' | 'mos';

export const INTEREST_METHOD_OPTIONS: readonly {
  value: InterestMethod;
  label: string;
}[] = [
  { value: 'monthly_us_uk', label: 'Monthly (US & UK)' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
];

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  adverb: string;
  periodsPerYear: number;
}[] = [
  { value: 'monthly', label: 'Monthly', adverb: 'monthly', periodsPerYear: 12 },
  {
    value: 'semi_monthly',
    label: 'Semi-monthly',
    adverb: 'semi-monthly',
    periodsPerYear: 24,
  },
  { value: 'biweekly', label: 'Bi-weekly', adverb: 'bi-weekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', adverb: 'weekly', periodsPerYear: 52 },
];

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
];

export interface MortgagePrepaymentInput {
  mortgageAmount: string;
  mortgageCurrency: SupportedCurrency;
  interestRatePercent: string;
  loanTerm: string;
  termUnit: TermUnit;
  interestMethod: InterestMethod;
  dueDate: string;
  paymentFrequency: PaymentFrequency;
  periodicPrepayment: string;
  periodicCurrency: SupportedCurrency;
  periodicStartDate: string;
  lumpSumPrepayment: string;
  lumpSumCurrency: SupportedCurrency;
  lumpSumDate: string;
}

export interface ScheduleSummary {
  payoffDate: string;
  formattedPayoffDate: string;
  periodicPayment: number;
  formattedPeriodicPayment: string;
  paymentAdverb: string;
  paymentCount: number;
  termYears: number;
  termMonths: number;
  formattedTerm: string;
  totalInterest: number;
  formattedTotalInterest: string;
  totalPayment: number;
  formattedTotalPayment: string;
}

export interface ChartPoint {
  year: number;
  remainingBalance: number;
  cumulativeInterest: number;
  prepaidRemainingBalance: number;
  prepaidCumulativeInterest: number;
}

export interface MortgagePrepaymentResult {
  currency: SupportedCurrency;
  hasPrepayments: boolean;
  baseline: ScheduleSummary;
  prepaid: ScheduleSummary | null;
  chart: ChartPoint[];
}

export type MortgagePrepaymentFieldErrors = {
  mortgageAmount?: string;
  interestRatePercent?: string;
  loanTerm?: string;
  dueDate?: string;
  periodicPrepayment?: string;
  periodicStartDate?: string;
  lumpSumPrepayment?: string;
  lumpSumDate?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): MortgagePrepaymentInput {
  const today = todayIsoDate();
  return {
    mortgageAmount: '100000',
    mortgageCurrency: 'PKR',
    interestRatePercent: '6',
    loanTerm: '30',
    termUnit: 'yrs',
    interestMethod: 'monthly_us_uk',
    dueDate: today,
    paymentFrequency: 'monthly',
    periodicPrepayment: '0',
    periodicCurrency: 'PKR',
    periodicStartDate: today,
    lumpSumPrepayment: '0',
    lumpSumCurrency: 'PKR',
    lumpSumDate: today,
  };
}
