import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni Mortgage Acceleration modes. */
export type AccelerationType =
  | 'accelerated_biweekly'
  | 'biweekly'
  | 'monthly_overpayment';

export type CompoundingFrequency = 'monthly_uk_us' | 'semi_annual_canada';

export type TermUnit = 'yrs' | 'mos';

export const ACCELERATION_TYPE_OPTIONS: readonly {
  value: AccelerationType;
  label: string;
}[] = [
  { value: 'accelerated_biweekly', label: 'Accelerated bi-weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly_overpayment', label: 'Monthly with overpayment' },
];

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'monthly_uk_us', label: 'Monthly (UK & US)' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
];

export interface MortgageAccelerationInput {
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  accelerationType: AccelerationType;
  mortgageTerm: string;
  termUnit: TermUnit;
  interestRatePercent: string;
  adjustFeesAndCompounding: boolean;
  compounding: CompoundingFrequency;
  mortgagePointsPercent: string;
  upfrontFee: string;
  upfrontFeeCurrency: SupportedCurrency;
  dueDate: string;
  extraPayment: string;
  extraPaymentCurrency: SupportedCurrency;
}

export interface ScheduleColumn {
  label: string;
  /** Periodic installment before extra principal (full precision). */
  periodicPayment: number;
  paymentSuffix: '/mo' | ' bi-weekly';
  paymentCount: number;
  termYears: number;
  termMonths: number;
  payoffDate: string;
  totalInterest: number;
  /** Principal + interest paid on the schedule (excludes closing costs). */
  totalPayments: number;
  additionalCosts: number;
  /** Schedule totals + closing costs. */
  grandTotal: number;
  formattedPeriodicPayment: string;
  formattedTerm: string;
  formattedPayoffDate: string;
  formattedTotalInterest: string;
  formattedTotalPayments: string;
  formattedAdditionalCosts: string;
  formattedGrandTotal: string;
}

export interface DifferenceColumn {
  paymentMonthlyEquivalent: number;
  termYears: number;
  termMonths: number;
  payoffSpanLabel: string;
  totalInterest: number;
  totalPayments: number;
  additionalCosts: number;
  grandTotal: number;
  formattedPayment: string;
  formattedTerm: string;
  formattedPayoff: string;
  formattedTotalInterest: string;
  formattedTotalPayments: string;
  formattedAdditionalCosts: string;
  formattedGrandTotal: string;
}

export interface MortgageAccelerationResult {
  calcCurrency: SupportedCurrency;
  withoutAcceleration: ScheduleColumn;
  accelerated: ScheduleColumn;
  difference: DifferenceColumn;
}

export type MortgageAccelerationFieldErrors = {
  loanAmount?: string;
  mortgageTerm?: string;
  interestRatePercent?: string;
  mortgagePointsPercent?: string;
  upfrontFee?: string;
  dueDate?: string;
  extraPayment?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): MortgageAccelerationInput {
  return {
    loanAmount: '300000',
    loanCurrency: 'PKR',
    accelerationType: 'accelerated_biweekly',
    mortgageTerm: '30',
    termUnit: 'yrs',
    interestRatePercent: '7.5',
    adjustFeesAndCompounding: false,
    compounding: 'monthly_uk_us',
    mortgagePointsPercent: '0',
    upfrontFee: '0',
    upfrontFeeCurrency: 'PKR',
    dueDate: todayIsoDate(),
    extraPayment: '0',
    extraPaymentCurrency: 'PKR',
  };
}
