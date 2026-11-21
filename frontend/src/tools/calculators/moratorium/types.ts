import type { SupportedCurrency } from '@/tools/shared/currency';

export type EstimationMode = 'loan-term' | 'monthly-payment';
export type InterestTreatment = 'capitalized' | 'paid-monthly';
export type RepaymentPlan =
  | 'increased-payment-same-term'
  | 'increased-payment-extended-term'
  | 'same-payment-extended-term';
export type CompoundingFrequency =
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';
export type TermUnit = 'months' | 'years';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
] as const;

export interface MoratoriumInput {
  currency: SupportedCurrency;
  estimationMode: EstimationMode;
  loanAmount: string;
  dateOfBalance: string;
  loanTermValue: string;
  loanTermUnit: TermUnit;
  monthlyPayment: string;
  annualInterestRate: string;
  enableCustomCompounding: boolean;
  compoundingFrequency: CompoundingFrequency;
  interestTreatment: InterestTreatment;
  repaymentPlan: RepaymentPlan;
  moratoriumStartDate: string;
  moratoriumDurationValue: string;
  moratoriumDurationUnit: TermUnit;
}

export interface ScheduleRow {
  paymentNumber: number;
  paymentDate: string;
  phase: 'pre-moratorium' | 'moratorium' | 'post-moratorium';
  openingBalance: number;
  payment: number;
  interest: number;
  principal: number;
  capitalizedInterest: number;
  closingBalance: number;
}

export interface MoratoriumResult {
  currency: SupportedCurrency;
  monthlyRate: number;
  originalEMI: number;
  revisedEMI: number;
  originalTermMonths: number;
  balanceAtMoratoriumStart: number;
  balanceAfterMoratorium: number;
  accruedMoratoriumInterest: number;
  paidMoratoriumInterest: number;
  capitalizedInterest: number;
  moratoriumMonths: number;
  paymentsBeforeMoratorium: number;
  originalRemainingPayments: number;
  revisedRemainingPayments: number;
  originalMaturityDate: string;
  revisedMaturityDate: string;
  originalTotalInterest: number;
  revisedTotalInterest: number;
  additionalInterestCost: number;
  totalRepayment: number;
  interestTreatment: InterestTreatment;
  repaymentPlan: RepaymentPlan;
  schedule: ScheduleRow[];
  warning: string | null;
  formattedOriginalEMI: string;
  formattedRevisedEMI: string;
  formattedBalanceAfter: string;
  formattedAdditionalCost: string;
  steps: string[];
  formulaBreakdown: string;
  interpretation: string;
  explanation: string;
}

export type MoratoriumFieldErrors = {
  form?: string;
  loanAmount?: string;
  dateOfBalance?: string;
  loanTermValue?: string;
  monthlyPayment?: string;
  annualInterestRate?: string;
  moratoriumStartDate?: string;
  moratoriumDurationValue?: string;
};

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createDefaultInput(): MoratoriumInput {
  const today = todayIso();
  return {
    currency: 'INR',
    estimationMode: 'loan-term',
    loanAmount: '',
    dateOfBalance: today,
    loanTermValue: '',
    loanTermUnit: 'years',
    monthlyPayment: '',
    annualInterestRate: '',
    enableCustomCompounding: false,
    compoundingFrequency: 'monthly',
    interestTreatment: 'capitalized',
    repaymentPlan: 'increased-payment-same-term',
    moratoriumStartDate: today,
    moratoriumDurationValue: '',
    moratoriumDurationUnit: 'months',
  };
}

export function createEmptyInput(): MoratoriumInput {
  return createDefaultInput();
}

/** Reference: ₹300,000 · 8% · 10y · 12-month capitalized moratorium */
export function createExampleInput(): MoratoriumInput {
  const today = todayIso();
  return {
    currency: 'INR',
    estimationMode: 'loan-term',
    loanAmount: '300000',
    dateOfBalance: today,
    loanTermValue: '10',
    loanTermUnit: 'years',
    monthlyPayment: '',
    annualInterestRate: '8',
    enableCustomCompounding: false,
    compoundingFrequency: 'monthly',
    interestTreatment: 'capitalized',
    repaymentPlan: 'increased-payment-same-term',
    moratoriumStartDate: today,
    moratoriumDurationValue: '12',
    moratoriumDurationUnit: 'months',
  };
}
