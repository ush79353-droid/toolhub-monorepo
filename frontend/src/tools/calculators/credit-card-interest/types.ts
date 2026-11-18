import type { SupportedCurrency } from '@/tools/shared/currency';

export type RepaymentMode = 'fixed' | 'minimum';

/** Verified Omni-style minimum payment formulas. */
export type MinimumPaymentMethod = 'flat_percent' | 'percent_plus_interest';

/**
 * Interest accrual for the monthly payoff loop.
 * Default `monthly` uses APR/1200 (matches screenshot). Daily options
 * compound within each month before the payment is applied.
 */
export type CompoundingMethod = 'monthly' | 'daily_365' | 'daily_360';

export const REPAYMENT_MODE_OPTIONS: readonly {
  value: RepaymentMode;
  label: string;
}[] = [
  { value: 'fixed', label: 'fixed payments' },
  { value: 'minimum', label: 'minimum payments' },
] as const;

export const MINIMUM_METHOD_OPTIONS: readonly {
  value: MinimumPaymentMethod;
  label: string;
}[] = [
  { value: 'flat_percent', label: 'Flat percentage' },
  {
    value: 'percent_plus_interest',
    label: 'Percentage + interest',
  },
] as const;

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingMethod;
  label: string;
}[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily_365', label: 'Daily (365)' },
  { value: 'daily_360', label: 'Daily (360)' },
] as const;

export interface CreditCardInterestInput {
  balance: string;
  balanceCurrency: SupportedCurrency;
  aprPercent: string;
  repaymentMode: RepaymentMode;
  fixedPayment: string;
  fixedPaymentCurrency: SupportedCurrency;
  additionalPayment: string;
  additionalPaymentCurrency: SupportedCurrency;
  /** Currency floor for minimum payment. */
  minPaymentFloor: string;
  minPaymentFloorCurrency: SupportedCurrency;
  minPaymentPercent: string;
  minPaymentMethod: MinimumPaymentMethod;
  compounding: CompoundingMethod;
  specificationsOpen: boolean;
  advancedOpen: boolean;
}

export interface CreditCardInterestResult {
  months: number;
  years: number;
  remainingMonths: number;
  totalPaid: number;
  totalInterest: number;
  /** First-month scheduled payment (before final-payment cap). */
  firstPayment: number;
  currency: SupportedCurrency;
  repaymentMode: RepaymentMode;
  compounding: CompoundingMethod;
  formattedFirstPayment: string;
  formattedTotalPaid: string;
  formattedTotalInterest: string;
  summary: string;
  breakdown: string;
  /** True when payment never covers interest (never pays off). */
  neverPaysOff: boolean;
}

export type CreditCardInterestFieldErrors = {
  balance?: string;
  aprPercent?: string;
  fixedPayment?: string;
  additionalPayment?: string;
  minPaymentFloor?: string;
  minPaymentPercent?: string;
  form?: string;
};

export function createDefaultInput(): CreditCardInterestInput {
  return {
    balance: '2000',
    balanceCurrency: 'PKR',
    aprPercent: '18',
    repaymentMode: 'fixed',
    fixedPayment: '100',
    fixedPaymentCurrency: 'PKR',
    additionalPayment: '0',
    additionalPaymentCurrency: 'PKR',
    minPaymentFloor: '25',
    minPaymentFloorCurrency: 'PKR',
    minPaymentPercent: '3',
    minPaymentMethod: 'flat_percent',
    compounding: 'monthly',
    specificationsOpen: true,
    advancedOpen: false,
  };
}
