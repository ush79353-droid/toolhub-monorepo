import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';

export type CompoundingFrequency =
  | 'continuously'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  /** Null means continuous compounding. */
  periodsPerYear: number | null;
}[] = [
  { value: 'continuously', label: 'Continuously', periodsPerYear: null },
  { value: 'daily', label: 'Daily (365/yr)', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly (52/yr)', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly (26/yr)', periodsPerYear: 26 },
  { value: 'semimonthly', label: 'Semimonthly (24/yr)', periodsPerYear: 24 },
  { value: 'monthly', label: 'Monthly (US & UK)', periodsPerYear: 12 },
  { value: 'bimonthly', label: 'Bimonthly (6/yr)', periodsPerYear: 6 },
  { value: 'quarterly', label: 'Quarterly (4/yr)', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually (Canada)', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually (1/yr)', periodsPerYear: 1 },
];

/** Screenshot defaults: original due date and refinance first-payment date. */
export const DEFAULT_CURRENT_DUE_DATE = '2021-09-02';
export const DEFAULT_NEW_DUE_DATE = '2026-11-16';

export interface MortgageRefinanceInput {
  originalAmount: string;
  originalAmountCurrency: SupportedCurrency;
  currentDueDate: string;
  currentTerm: string;
  currentTermUnit: TermUnit;
  currentInterestRatePercent: string;
  currentCompounding: CompoundingFrequency;
  newDueDate: string;
  newTerm: string;
  newTermUnit: TermUnit;
  newInterestRatePercent: string;
  newCompounding: CompoundingFrequency;
  mortgagePoints: string;
  closingCosts: string;
  closingCostsCurrency: SupportedCurrency;
  /**
   * Positive = cash out (borrow more). Negative = cash in (pay down principal).
   */
  cashInOut: string;
  cashInOutCurrency: SupportedCurrency;
}

export interface LoanColumn {
  principal: number;
  monthlyPayment: number;
  annualRatePercent: number;
  termMonths: number;
  totalInterest: number;
  /** Current: payment × remaining months. New: payment × term + upfront refinance cost. */
  totalPayments: number;
}

export interface MortgageRefinanceResult {
  currency: SupportedCurrency;
  current: LoanColumn;
  neu: LoanColumn;
  elapsedMonths: number;
  pointsCost: number;
  closingCosts: number;
  /** Points + closing costs. Paid upfront; not added to the new principal. */
  refinancingCost: number;
  /** Current payment − new payment. Positive means a lower new payment. */
  monthlySavings: number;
  /** Null when monthly savings never recover the upfront cost. */
  breakEvenMonths: number | null;
  breakEvenDateIso: string | null;
  formattedCurrentPrincipal: string;
  formattedNewPrincipal: string;
  formattedCurrentPayment: string;
  formattedNewPayment: string;
  formattedCurrentInterest: string;
  formattedNewInterest: string;
  formattedCurrentTotalPayments: string;
  formattedNewTotalPayments: string;
  formattedRefinancingCost: string;
  formattedMonthlySavings: string;
  formattedPointsCost: string;
  formattedClosingCosts: string;
}

export type MortgageRefinanceFieldErrors = {
  originalAmount?: string;
  currentDueDate?: string;
  currentTerm?: string;
  currentInterestRatePercent?: string;
  newDueDate?: string;
  newTerm?: string;
  newInterestRatePercent?: string;
  mortgagePoints?: string;
  closingCosts?: string;
  cashInOut?: string;
  form?: string;
};

export function createDefaultInput(): MortgageRefinanceInput {
  return {
    originalAmount: '300000',
    originalAmountCurrency: 'PKR',
    currentDueDate: DEFAULT_CURRENT_DUE_DATE,
    currentTerm: '30',
    currentTermUnit: 'yrs',
    currentInterestRatePercent: '3.5',
    currentCompounding: 'monthly',
    newDueDate: DEFAULT_NEW_DUE_DATE,
    newTerm: '25',
    newTermUnit: 'yrs',
    newInterestRatePercent: '2.5',
    newCompounding: 'monthly',
    mortgagePoints: '1',
    closingCosts: '1500',
    closingCostsCurrency: 'PKR',
    cashInOut: '2500',
    cashInOutCurrency: 'PKR',
  };
}
