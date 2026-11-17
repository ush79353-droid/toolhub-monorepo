import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni-confirmed compounding conventions for fixed-rate mortgages. */
export type CompoundingFrequency =
  | 'yearly'
  | 'semi_annual_canada'
  | 'quarterly'
  | 'monthly_uk_us';

export type TermUnit = 'yrs' | 'mos';

/** Screenshot + ADR-023: Fixed-rate only — do not invent ARM modes. */
export type MortgageType = 'fixed_rate';

export type RepaymentPresentation = 'chart' | 'schedule' | 'both';

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly_uk_us', label: 'Monthly (UK & US)' },
] as const;

export const MORTGAGE_TYPE_OPTIONS: readonly {
  value: MortgageType;
  label: string;
}[] = [{ value: 'fixed_rate', label: 'Fixed-rate' }] as const;

export const TERM_UNIT_OPTIONS: readonly {
  value: TermUnit;
  label: string;
}[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
] as const;

export const REPAYMENT_PRESENTATION_OPTIONS: readonly {
  value: RepaymentPresentation;
  label: string;
}[] = [
  { value: 'chart', label: 'Chart of balances' },
  { value: 'schedule', label: 'Amortization schedule' },
  { value: 'both', label: 'Both' },
] as const;

export interface MortgageInterestInput {
  principal: string;
  principalCurrency: SupportedCurrency;
  mortgageTerm: string;
  termUnit: TermUnit;
  interestRatePercent: string;
  compounding: CompoundingFrequency;
  /** When true: mortgage points, up-front fee, and annual fee are applied. */
  addFees: boolean;
  mortgageType: MortgageType;
  mortgagePointsPercent: string;
  upfrontFee: string;
  upfrontFeeCurrency: SupportedCurrency;
  annualFee: string;
  annualFeeCurrency: SupportedCurrency;
  /** Independent display currency for monthly payment. */
  paymentCurrency: SupportedCurrency;
  /** Independent display currency for mortgage interest. */
  interestCurrency: SupportedCurrency;
  /** Independent display currency for total payments. */
  totalCurrency: SupportedCurrency;
  repaymentPresentation: RepaymentPresentation;
  /** ISO date (YYYY-MM-DD) anchoring schedule / chart calendar labels. */
  scheduleFrom: string;
}

export interface AnnualChartPoint {
  /** Calendar year label derived from scheduleFrom. */
  calendarYear: number;
  /** Elapsed loan years (0 at start). */
  year: number;
  loanBalance: number;
  principalPaid: number;
  interestPaid: number;
}

export interface ScheduleRow {
  paymentNumber: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  annualRatePercent: number;
}

export interface MortgageInterestResult {
  monthlyPaymentInLoan: number;
  monthlyPayment: number;
  formattedMonthlyPayment: string;
  aprPercent: number;
  formattedApr: string;
  mortgageInterestInLoan: number;
  mortgageInterest: number;
  formattedMortgageInterest: string;
  totalPaymentsInLoan: number;
  totalPayments: number;
  formattedTotalPayments: string;
  pointsCostInLoan: number;
  chartPoints: AnnualChartPoint[];
  schedule: ScheduleRow[];
  loanCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
  interestCurrency: SupportedCurrency;
  totalCurrency: SupportedCurrency;
}

export type MortgageInterestFieldErrors = {
  principal?: string;
  mortgageTerm?: string;
  interestRatePercent?: string;
  mortgagePointsPercent?: string;
  upfrontFee?: string;
  annualFee?: string;
  scheduleFrom?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): MortgageInterestInput {
  return {
    principal: '250000',
    principalCurrency: 'PKR',
    mortgageTerm: '20',
    termUnit: 'yrs',
    interestRatePercent: '5',
    compounding: 'monthly_uk_us',
    addFees: false,
    mortgageType: 'fixed_rate',
    mortgagePointsPercent: '0',
    upfrontFee: '0',
    upfrontFeeCurrency: 'PKR',
    annualFee: '0',
    annualFeeCurrency: 'PKR',
    paymentCurrency: 'PKR',
    interestCurrency: 'PKR',
    totalCurrency: 'PKR',
    repaymentPresentation: 'chart',
    scheduleFrom: todayIsoDate(),
  };
}
