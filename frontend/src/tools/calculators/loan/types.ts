export type {
  CurrencyOption,
  SupportedCurrency,
} from '@/tools/shared/currency';
export {
  CURRENCY_DENOMINATION_NOTE,
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
  formatCurrencyValue,
  getCurrencyShortLabel,
  getCurrencySymbol,
} from '@/tools/shared/currency';
import { DEFAULT_CURRENCY, type SupportedCurrency } from '@/tools/shared/currency';

export type LoanMode = 'amortized' | 'interest-only';

export type TermUnit = 'months' | 'years';

export type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly';

export type ExtraPaymentFrequency = 'every-payment' | 'monthly' | 'yearly';

export type FeeMode = 'amount' | 'percent';

export type FeeInclusion = 'upfront' | 'finance';

export interface LoanInput {
  loanMode: LoanMode;
  loanAmount: number;
  annualInterestRate: number;
  loanTermValue: number;
  loanTermUnit: TermUnit;
  paymentFrequency: PaymentFrequency;
  interestOnlyValue: number;
  interestOnlyUnit: TermUnit;
  originationFeeValue: number;
  originationFeeMode: FeeMode;
  feeInclusion: FeeInclusion;
  extraPaymentAmount: number;
  extraPaymentFrequency: ExtraPaymentFrequency;
  oneTimeExtraAmount: number;
  oneTimeExtraPeriod: number;
  startDate: string;
  currency: SupportedCurrency;
}

export type LoanFieldKey = keyof LoanInput | 'form';

export type LoanFieldErrors = Partial<Record<LoanFieldKey, string>>;

export interface LoanValidationResult {
  isValid: boolean;
  errors: LoanFieldErrors;
}

export interface LoanScheduleRow {
  periodNumber: number;
  paymentDate: string;
  phase: 'interest-only' | 'amortized';
  beginningBalance: number;
  regularPayment: number;
  extraPayment: number;
  totalPayment: number;
  regularPrincipalPaid: number;
  extraPrincipalPaid: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface LoanYearlyRow {
  year: number;
  paymentsCount: number;
  beginningBalance: number;
  regularPayment: number;
  extraPayment: number;
  totalPayment: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface LoanScheduleTotals {
  regularPayment: number;
  extraPayment: number;
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
}

export interface LoanBalancePoint {
  period: number;
  balance: number;
  baselineBalance: number;
}

export interface LoanResult {
  currency: SupportedCurrency;
  loanMode: LoanMode;
  paymentFrequency: PaymentFrequency;
  paymentsPerYear: number;
  originalLoanAmount: number;
  originationFeeAmount: number;
  financedFeeAmount: number;
  upfrontFeeAmount: number;
  amountFinanced: number;
  annualInterestRate: number;
  periodicInterestRate: number;
  totalMonths: number;
  scheduledPaymentsCount: number;
  interestOnlyMonths: number;
  interestOnlyPeriods: number;
  actualPaymentsCount: number;
  paymentsSaved: number;
  regularPayment: number;
  postInterestOnlyPayment: number | null;
  finalPayment: number;
  totalRegularPayments: number;
  totalExtraPayments: number;
  totalPaid: number;
  totalCostWithFees: number;
  totalInterest: number;
  baselineTotalInterest: number;
  interestSavings: number;
  hasExtraPayments: boolean;
  remainingBalanceAfterIo: number | null;
  remainingBalanceAtEnd: number;
  startDate: string;
  payoffDate: string;
  baselinePayoffDate: string;
  principalRatioPercent: number;
  interestRatioPercent: number;
  schedule: LoanScheduleRow[];
  yearlySchedule: LoanYearlyRow[];
  scheduleTotals: LoanScheduleTotals;
  balanceCurve: LoanBalancePoint[];
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultLoanInput(startDate = getTodayIsoDate()): LoanInput {
  return {
    loanMode: 'amortized',
    loanAmount: 25000,
    annualInterestRate: 6,
    loanTermValue: 5,
    loanTermUnit: 'years',
    paymentFrequency: 'monthly',
    interestOnlyValue: 1,
    interestOnlyUnit: 'years',
    originationFeeValue: 0,
    originationFeeMode: 'amount',
    feeInclusion: 'upfront',
    extraPaymentAmount: 0,
    extraPaymentFrequency: 'every-payment',
    oneTimeExtraAmount: 0,
    oneTimeExtraPeriod: 1,
    startDate,
    currency: DEFAULT_CURRENCY,
  };
}

