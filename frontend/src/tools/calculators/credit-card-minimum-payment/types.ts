import type { SupportedCurrency } from '@/tools/shared/currency';

/** Verified Omni-style minimum payment formulas. */
export type MinimumPaymentMethod = 'flat_percent' | 'percent_plus_interest';

/**
 * Interest accrual for the monthly payoff loop.
 * Screenshot defaults match Daily (360) when capitalization is unchanged.
 */
export type CompoundingMethod = 'monthly' | 'daily_365' | 'daily_360';

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

/** Default compounding when “Change capitalization frequency” is unchecked. */
export const DEFAULT_COMPOUNDING: CompoundingMethod = 'daily_360';

export interface CreditCardMinimumPaymentInput {
  statementBalance: string;
  statementBalanceCurrency: SupportedCurrency;
  dueDate: string;
  aprPercent: string;
  changeCapitalization: boolean;
  compounding: CompoundingMethod;
  minPaymentFloor: string;
  minPaymentFloorCurrency: SupportedCurrency;
  minPaymentPercent: string;
  minPaymentMethod: MinimumPaymentMethod;
  /** Optional fixed amount added each month on top of the minimum (not a replacement). */
  monthlyFixPayment: string;
  monthlyFixPaymentCurrency: SupportedCurrency;
  specificationsOpen: boolean;
  paymentSettingsOpen: boolean;
}

export interface CreditCardMinimumPaymentResult {
  months: number;
  years: number;
  remainingMonths: number;
  payoffDateIso: string;
  payoffDateDisplay: string;
  totalPaid: number;
  totalInterest: number;
  currency: SupportedCurrency;
  compounding: CompoundingMethod;
  formattedTotalPaid: string;
  formattedTotalInterest: string;
  summary: string;
  breakdown: string;
  neverPaysOff: boolean;
}

export type CreditCardMinimumPaymentFieldErrors = {
  statementBalance?: string;
  dueDate?: string;
  aprPercent?: string;
  minPaymentFloor?: string;
  minPaymentPercent?: string;
  monthlyFixPayment?: string;
  form?: string;
};

export function createDefaultInput(): CreditCardMinimumPaymentInput {
  return {
    statementBalance: '1500',
    statementBalanceCurrency: 'PKR',
    dueDate: '2026-11-18',
    aprPercent: '18',
    changeCapitalization: false,
    compounding: DEFAULT_COMPOUNDING,
    minPaymentFloor: '25',
    minPaymentFloorCurrency: 'PKR',
    minPaymentPercent: '3',
    minPaymentMethod: 'flat_percent',
    monthlyFixPayment: '0',
    monthlyFixPaymentCurrency: 'PKR',
    specificationsOpen: true,
    paymentSettingsOpen: true,
  };
}
