import type { SupportedCurrency } from '@/tools/shared/currency';

export type EmiTermUnit = 'years' | 'months';

export interface EmiInput {
  currency: SupportedCurrency;
  principal: string;
  termValue: string;
  termUnit: EmiTermUnit;
  annualInterestRate: string;
  /** Optional: payments already made for outstanding balance */
  enableBalanceLookup: boolean;
  paymentsMade: string;
  /** Optional extra monthly payment toward principal */
  enableExtraPayment: boolean;
  extraMonthlyPayment: string;
  /** Optional second loan for comparison */
  enableComparison: boolean;
  comparePrincipal: string;
  compareRate: string;
  compareTermValue: string;
  compareTermUnit: EmiTermUnit;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  extraPaid: number;
}

export interface EmiYearlySummary {
  year: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface EmiLoanSnapshot {
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
  monthlyEMI: number;
  totalPayable: number;
  totalInterest: number;
  totalPayments: number;
}

export interface EmiResult {
  currency: SupportedCurrency;
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
  termLabel: string;
  monthlyInterestRate: number;
  monthlyEMI: number;
  totalPayable: number;
  totalInterest: number;
  totalPayments: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
  schedule: AmortizationEntry[];
  yearlySummary: EmiYearlySummary[];
  /** With optional extra payments */
  hasExtraPayment: boolean;
  extraMonthlyPayment: number;
  payoffMonthsWithExtra: number | null;
  totalInterestWithExtra: number | null;
  interestSaved: number | null;
  monthsSaved: number | null;
  scheduleWithExtra: AmortizationEntry[] | null;
  /** Outstanding after k payments (base schedule, no extra) */
  paymentsMade: number | null;
  outstandingBalance: number | null;
  principalRepaidToDate: number | null;
  interestPaidToDate: number | null;
  remainingInstallments: number | null;
  comparison: {
    loanA: EmiLoanSnapshot;
    loanB: EmiLoanSnapshot;
    emiDiff: number;
    interestDiff: number;
    payableDiff: number;
  } | null;
  formattedPrincipal: string;
  formattedEMI: string;
  formattedTotalPayable: string;
  formattedTotalInterest: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type EmiFieldErrors = {
  form?: string;
  principal?: string;
  termValue?: string;
  annualInterestRate?: string;
  paymentsMade?: string;
  extraMonthlyPayment?: string;
  comparePrincipal?: string;
  compareRate?: string;
  compareTermValue?: string;
};

export function createDefaultInput(): EmiInput {
  return {
    currency: 'PKR',
    principal: '',
    termValue: '',
    termUnit: 'years',
    annualInterestRate: '',
    enableBalanceLookup: false,
    paymentsMade: '',
    enableExtraPayment: false,
    extraMonthlyPayment: '',
    enableComparison: false,
    comparePrincipal: '',
    compareRate: '',
    compareTermValue: '',
    compareTermUnit: 'years',
  };
}

export function createEmptyInput(): EmiInput {
  return createDefaultInput();
}

/** Reference: PKR 500,000 · 10% · 5 years → EMI ≈ 10,623.52 */
export function createExampleInput(): EmiInput {
  return {
    currency: 'PKR',
    principal: '500000',
    termValue: '5',
    termUnit: 'years',
    annualInterestRate: '10',
    enableBalanceLookup: false,
    paymentsMade: '',
    enableExtraPayment: false,
    extraMonthlyPayment: '',
    enableComparison: false,
    comparePrincipal: '',
    compareRate: '',
    compareTermValue: '',
    compareTermUnit: 'years',
  };
}
