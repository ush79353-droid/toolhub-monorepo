import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni-style compounding from the reference screenshot. */
export type InterestMethod = 'monthly_us_uk' | 'semi_annual_canada';

/**
 * Payment frequency applied on the "With extra" schedule.
 * Accelerated bi-weekly / weekly pay half / quarter of the monthly installment
 * more often; ordinary bi-weekly / weekly spread the same annual cash.
 */
export type PaymentFrequency =
  | 'monthly'
  | 'semi_monthly'
  | 'biweekly'
  | 'accelerated_biweekly'
  | 'weekly'
  | 'accelerated_weekly';

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
  freqLabel: string;
  periodsPerYear: number;
  /** How scheduled installment relates to the baseline monthly payment. */
  paymentFactor: 'full' | 'half' | 'quarter' | 'annual_over_ppy';
}[] = [
  {
    value: 'monthly',
    label: 'Monthly',
    freqLabel: 'Monthly',
    periodsPerYear: 12,
    paymentFactor: 'full',
  },
  {
    value: 'semi_monthly',
    label: 'Semi-monthly',
    freqLabel: 'Semi-monthly',
    periodsPerYear: 24,
    paymentFactor: 'half',
  },
  {
    value: 'biweekly',
    label: 'Bi-weekly',
    freqLabel: 'Bi-weekly',
    periodsPerYear: 26,
    paymentFactor: 'annual_over_ppy',
  },
  {
    value: 'accelerated_biweekly',
    label: 'Accelerated bi-weekly',
    freqLabel: 'Bi-weekly',
    periodsPerYear: 26,
    paymentFactor: 'half',
  },
  {
    value: 'weekly',
    label: 'Weekly',
    freqLabel: 'Weekly',
    periodsPerYear: 52,
    paymentFactor: 'annual_over_ppy',
  },
  {
    value: 'accelerated_weekly',
    label: 'Accelerated weekly',
    freqLabel: 'Weekly',
    periodsPerYear: 52,
    paymentFactor: 'quarter',
  },
];

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
];

export interface MortgageWithExtraPaymentsInput {
  mortgageAmount: string;
  mortgageCurrency: SupportedCurrency;
  interestRatePercent: string;
  loanTerm: string;
  termUnit: TermUnit;
  interestMethod: InterestMethod;
  dueDate: string;
  paymentFrequency: PaymentFrequency;
  periodicExtra: string;
  periodicCurrency: SupportedCurrency;
  periodicStartDate: string;
  lumpSum: string;
  lumpSumCurrency: SupportedCurrency;
  lumpSumDate: string;
}

export interface ScheduleColumn {
  label: string;
  payoffDate: string;
  formattedPayoffDate: string;
  periodicPayment: number;
  formattedPayment: string;
  freqLabel: string;
  paymentCount: number;
  termYears: number;
  termMonths: number;
  formattedTerm: string;
  totalInterest: number;
  formattedInterest: string;
  totalPayment: number;
  formattedTotalPayment: string;
}

export interface DifferenceColumn {
  formattedPayoff: string;
  formattedPayment: string;
  formattedFreq: string;
  formattedTerm: string;
  formattedInterest: string;
  formattedTotalPayment: string;
}

export interface MortgageWithExtraPaymentsResult {
  currency: SupportedCurrency;
  original: ScheduleColumn;
  withExtra: ScheduleColumn;
  difference: DifferenceColumn;
}

export type MortgageWithExtraPaymentsFieldErrors = {
  mortgageAmount?: string;
  interestRatePercent?: string;
  loanTerm?: string;
  dueDate?: string;
  periodicExtra?: string;
  periodicStartDate?: string;
  lumpSum?: string;
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

/** Screenshot defaults: 135,000 · 4.5% · 20 yrs · accelerated bi-weekly. */
export function createDefaultInput(): MortgageWithExtraPaymentsInput {
  const today = todayIsoDate();
  return {
    mortgageAmount: '135000',
    mortgageCurrency: 'PKR',
    interestRatePercent: '4.5',
    loanTerm: '20',
    termUnit: 'yrs',
    interestMethod: 'monthly_us_uk',
    dueDate: today,
    paymentFrequency: 'accelerated_biweekly',
    periodicExtra: '0',
    periodicCurrency: 'PKR',
    periodicStartDate: today,
    lumpSum: '0',
    lumpSumCurrency: 'PKR',
    lumpSumDate: today,
  };
}
