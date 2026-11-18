import type { SupportedCurrency } from '@/tools/shared/currency';

/** Only verified screenshot mode. */
export type PaymentMode = 'specified_payback_term';

/** Verified Omni-style minimum payment formulas (sibling credit-card tools). */
export type MinimumPaymentMethod = 'flat_percent' | 'percent_plus_interest';

/**
 * Interest / period-rate convention for the required-payment solve.
 * Default `daily_360` matches the screenshot sample (≈ PKR 91.74).
 */
export type CompoundingMethod = 'monthly' | 'daily_365' | 'daily_360';

export const PAYMENT_MODE_OPTIONS: readonly {
  value: PaymentMode;
  label: string;
}[] = [
  { value: 'specified_payback_term', label: 'specified payback term' },
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

/** Default compounding matching screenshot totals. */
export const DEFAULT_COMPOUNDING: CompoundingMethod = 'daily_360';

export interface CreditCardPaymentInput {
  paymentMode: PaymentMode;
  balance: string;
  balanceCurrency: SupportedCurrency;
  dueDate: string;
  aprPercent: string;
  termYears: string;
  termMonths: string;
  minPaymentFloor: string;
  minPaymentFloorCurrency: SupportedCurrency;
  minPaymentPercent: string;
  minPaymentMethod: MinimumPaymentMethod;
  compounding: CompoundingMethod;
  specificationsOpen: boolean;
  advancedOpen: boolean;
}

export interface CreditCardPaymentResult {
  monthlyPayment: number;
  months: number;
  years: number;
  remainingMonths: number;
  payoffDateIso: string;
  payoffDateDisplay: string;
  totalPaid: number;
  totalInterest: number;
  currency: SupportedCurrency;
  compounding: CompoundingMethod;
  formattedMonthlyPayment: string;
  formattedTotalPaid: string;
  formattedTotalInterest: string;
  summary: string;
  breakdown: string;
  /** True when required payment was raised to meet the card minimum. */
  paymentRaisedToMinimum: boolean;
  belowMinimumWithoutRaise: boolean;
}

export type CreditCardPaymentFieldErrors = {
  balance?: string;
  dueDate?: string;
  aprPercent?: string;
  termYears?: string;
  termMonths?: string;
  minPaymentFloor?: string;
  minPaymentPercent?: string;
  form?: string;
};

export function createDefaultInput(): CreditCardPaymentInput {
  return {
    paymentMode: 'specified_payback_term',
    balance: '1000',
    balanceCurrency: 'PKR',
    dueDate: '2026-11-18',
    aprPercent: '18',
    termYears: '1',
    termMonths: '0',
    minPaymentFloor: '25',
    minPaymentFloorCurrency: 'PKR',
    minPaymentPercent: '3',
    minPaymentMethod: 'flat_percent',
    compounding: DEFAULT_COMPOUNDING,
    specificationsOpen: true,
    advancedOpen: false,
  };
}
