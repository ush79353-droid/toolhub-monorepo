import type { SupportedCurrency } from '@/tools/shared/currency';

export type RepaymentMode = 'fixed-term' | 'fixed-installment';

export type CompoundFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type PaymentFrequency =
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'semimonthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export const COMPOUND_OPTIONS: ReadonlyArray<{
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}> = [
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'semimonthly', label: 'Semimonthly', periodsPerYear: 24 },
  { value: 'monthly', label: 'Monthly (APR)', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
];

export const PAYMENT_OPTIONS: ReadonlyArray<{
  value: PaymentFrequency;
  label: string;
  periodsPerYear: number;
}> = [
  { value: 'monthly', label: 'Every month', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Every two weeks', periodsPerYear: 26 },
  { value: 'weekly', label: 'Every week', periodsPerYear: 52 },
  { value: 'semimonthly', label: 'Twice per month', periodsPerYear: 24 },
  { value: 'quarterly', label: 'Every quarter', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Every six months', periodsPerYear: 2 },
  { value: 'annually', label: 'Every year', periodsPerYear: 1 },
];

export const MAX_SCHEDULE_ROWS = 1200;

export interface AmortizationRow {
  paymentNumber: number;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface RepaymentInput {
  loanBalance: string;
  annualInterestRate: string;
  compounding: CompoundFrequency;
  paymentFrequency: PaymentFrequency;
  mode: RepaymentMode;
  years: string;
  months: string;
  fixedInstallment: string;
  currency: SupportedCurrency;
}

export interface RepaymentResult {
  mode: RepaymentMode;
  paymentAmount: number;
  numberOfPayments: number;
  finalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  effectivePeriodicRate: number;
  paymentsPerYear: number;
  compoundingPeriodsPerYear: number;
  paymentFrequencyLabel: string;
  schedule: AmortizationRow[];
  nonAmortizing: boolean;
  nonAmortizingMessage: string | null;
  currency: SupportedCurrency;
  formattedPayment: string;
  formattedFinalPayment: string;
  formattedTotalRepayment: string;
  formattedTotalInterest: string;
  formattedPrincipal: string;
  interpretation: string;
  warningMessage: string | null;
}

export type RepaymentFieldErrors = {
  form?: string;
  loanBalance?: string;
  annualInterestRate?: string;
  years?: string;
  months?: string;
  fixedInstallment?: string;
};

export function createDefaultInput(): RepaymentInput {
  return {
    loanBalance: '10000',
    annualInterestRate: '10',
    compounding: 'monthly',
    paymentFrequency: 'monthly',
    mode: 'fixed-term',
    years: '5',
    months: '0',
    fixedInstallment: '300',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): RepaymentInput {
  return {
    loanBalance: '',
    annualInterestRate: '',
    compounding: 'monthly',
    paymentFrequency: 'monthly',
    mode: 'fixed-term',
    years: '',
    months: '',
    fixedInstallment: '',
    currency,
  };
}
