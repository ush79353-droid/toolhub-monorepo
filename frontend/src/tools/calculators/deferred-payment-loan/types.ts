import type { SupportedCurrency } from '@/tools/shared/currency';

/** Estimation base — screenshot radios. */
export type EstimationMode = 'loan_term' | 'monthly_payment';

/** Omni-confirmed compounding frequencies. */
export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily'
  | 'continuous';

/** Omni-confirmed interest treatments during deferment. */
export type InterestTreatment =
  | 'capitalized'
  | 'paid_monthly'
  | 'paid_equal_parts'
  | 'interest_free';

/** Omni-confirmed post-deferment repayment styles. */
export type RepaymentType =
  | 'increased_original_term'
  | 'increased_extended_term'
  | 'original_payment_extended';

export const ESTIMATION_MODE_OPTIONS: readonly {
  value: EstimationMode;
  label: string;
}[] = [
  { value: 'loan_term', label: 'Loan term' },
  { value: 'monthly_payment', label: 'Monthly payment' },
] as const;

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'semiannually', label: 'Semi-annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily (365)' },
  { value: 'continuous', label: 'Continuously' },
] as const;

export const INTEREST_TREATMENT_OPTIONS: readonly {
  value: InterestTreatment;
  label: string;
}[] = [
  { value: 'capitalized', label: 'Capitalized (added to principal)' },
  { value: 'paid_monthly', label: 'Paid monthly during deferment' },
  {
    value: 'paid_equal_parts',
    label: 'Paid in equal parts (accumulated separately)',
  },
  { value: 'interest_free', label: 'Interest-free' },
] as const;

export const REPAYMENT_TYPE_OPTIONS: readonly {
  value: RepaymentType;
  label: string;
}[] = [
  { value: 'increased_original_term', label: 'Increased payment - original term' },
  {
    value: 'increased_extended_term',
    label: 'Increased payment - extended term',
  },
  { value: 'original_payment_extended', label: 'Original payment - extended term' },
] as const;

export interface DeferredPaymentLoanInput {
  estimationMode: EstimationMode;
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  balanceDate: string;
  termYears: string;
  termMonths: string;
  interestRatePercent: string;
  compoundingFrequency: CompoundingFrequency;
  /** Editable when estimationMode is monthly_payment; otherwise display-only. */
  originalMonthlyPayment: string;
  paymentCurrency: SupportedCurrency;
  interestTreatment: InterestTreatment;
  repaymentType: RepaymentType;
  defermentFrom: string;
  deferredMonths: string;
}

export interface ScenarioSummary {
  monthlyPayment: number;
  interest: number;
  totalPaid: number;
  termMonths: number;
  paymentCount: number;
  payoffDate: string;
}

export interface DeferredPaymentLoanResult {
  loanCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
  /** Original monthly payment in loan currency (full precision). */
  originalMonthlyPaymentLoan: number;
  /** Original monthly payment in payment display currency. */
  originalMonthlyPaymentDisplay: number;
  formattedOriginalMonthlyPayment: string;
  balanceAtDefermentStart: number;
  balanceAfterDeferment: number;
  deferredInterest: number;
  formattedBalanceStart: string;
  formattedBalanceAfter: string;
  formattedDeferredInterest: string;
  without: ScenarioSummary;
  withDefer: ScenarioSummary;
  diffMonthly: number;
  diffInterest: number;
  diffTotalPaid: number;
  diffTermMonths: number;
  diffPaymentCount: number;
  narrative: string;
}

export type DeferredPaymentLoanFieldErrors = {
  loanAmount?: string;
  balanceDate?: string;
  termYears?: string;
  termMonths?: string;
  interestRatePercent?: string;
  originalMonthlyPayment?: string;
  defermentFrom?: string;
  deferredMonths?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): DeferredPaymentLoanInput {
  const today = todayIsoDate();
  return {
    estimationMode: 'loan_term',
    loanAmount: '100000',
    loanCurrency: 'PKR',
    balanceDate: today,
    termYears: '10',
    termMonths: '0',
    interestRatePercent: '5',
    compoundingFrequency: 'monthly',
    originalMonthlyPayment: '',
    paymentCurrency: 'PKR',
    interestTreatment: 'capitalized',
    repaymentType: 'increased_original_term',
    defermentFrom: today,
    deferredMonths: '12',
  };
}
