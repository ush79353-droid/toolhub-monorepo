import type { SupportedCurrency } from '@/tools/shared/currency';

export type EstimationMode = 'remaining_term' | 'monthly_payment';
export type TermUnit = 'yrs' | 'mos';
export type FeeTreatment = 'upfront' | 'financed';
export type CompoundingFrequency = 'monthly';

export interface CarRefinanceInput {
  estimationMode: EstimationMode;
  /** Remaining balance on the current loan. */
  balance: string;
  balanceCurrency: SupportedCurrency;
  /** Used when estimationMode === 'remaining_term'. */
  remainingTerm: string;
  remainingTermUnit: TermUnit;
  /** Used when estimationMode === 'monthly_payment'. */
  currentMonthlyPayment: string;
  currentMonthlyPaymentCurrency: SupportedCurrency;
  currentInterestRatePercent: string;
  setDueDateAndCompounding: boolean;
  dueDate: string;
  compounding: CompoundingFrequency;
  newLoanTerm: string;
  newLoanTermUnit: TermUnit;
  newInterestRatePercent: string;
  /**
   * Sign convention: positive = cash out (adds to new principal);
   * negative = cash in (reduces new principal).
   */
  cashInOut: string;
  cashInOutCurrency: SupportedCurrency;
  setFeesAndCosts: boolean;
  feesAndCosts: string;
  feesAndCostsCurrency: SupportedCurrency;
  feeTreatment: FeeTreatment;
}

export interface LoanSideSummary {
  loanAmount: number;
  monthlyPayment: number;
  interestRatePercent: number;
  termMonths: number;
  termLabel: string;
  totalInterest: number;
  totalPayments: number;
  formattedLoanAmount: string;
  formattedMonthlyPayment: string;
  formattedTotalInterest: string;
  formattedTotalPayments: string;
}

export interface CarRefinanceResult {
  currency: SupportedCurrency;
  current: LoanSideSummary;
  neu: LoanSideSummary;
  /** Current monthly − new monthly (positive = monthly savings). */
  monthlyPaymentDiffAmount: number;
  /** Current total interest − new total interest. */
  totalInterestDiffAmount: number;
  /** Current total payments − new total payments (includes upfront fees on new). */
  totalPaymentsDiffAmount: number;
  formattedMonthlyPaymentDiff: string;
  formattedTotalInterestDiff: string;
  formattedTotalPaymentsDiff: string;
  /** Short explanation of savings or extra cost. */
  explanation: string;
  cashInOutCanonical: number;
  feesCanonical: number;
  feesFinanced: boolean;
  upfrontFees: number;
}

export type CarRefinanceFieldErrors = {
  balance?: string;
  remainingTerm?: string;
  currentMonthlyPayment?: string;
  currentInterestRatePercent?: string;
  newLoanTerm?: string;
  newInterestRatePercent?: string;
  cashInOut?: string;
  feesAndCosts?: string;
  dueDate?: string;
  form?: string;
};

export function createDefaultInput(): CarRefinanceInput {
  return {
    estimationMode: 'remaining_term',
    balance: '32000',
    balanceCurrency: 'PKR',
    remainingTerm: '6',
    remainingTermUnit: 'yrs',
    currentMonthlyPayment: '',
    currentMonthlyPaymentCurrency: 'PKR',
    currentInterestRatePercent: '8.5',
    setDueDateAndCompounding: false,
    dueDate: '',
    compounding: 'monthly',
    newLoanTerm: '5',
    newLoanTermUnit: 'yrs',
    newInterestRatePercent: '4.5',
    cashInOut: '0',
    cashInOutCurrency: 'PKR',
    setFeesAndCosts: false,
    feesAndCosts: '0',
    feesAndCostsCurrency: 'PKR',
    feeTreatment: 'upfront',
  };
}
