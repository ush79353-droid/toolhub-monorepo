import type { SupportedCurrency } from '@/tools/shared/currency';

export interface GratuityInput {
  /** Final month's salary + D.A. (money). */
  salary: string;
  salaryCurrency: SupportedCurrency;
  /** Whole years of service. Never FX-converted. */
  years: string;
  /** Months of service (0–11 preferred). Never FX-converted. */
  months: string;
  /** Display currency for total gratuity. */
  gratuityCurrency: SupportedCurrency;
}

export interface GratuityResult {
  /** Full-precision gratuity in salary currency. */
  gratuityCanonical: number;
  /** Display amount after FX into gratuityCurrency. */
  gratuity: number;
  salaryCurrency: SupportedCurrency;
  gratuityCurrency: SupportedCurrency;
  formattedGratuity: string;
  /** Years used in the 15/26 formula after >6-month rounding. */
  eligibleYears: number;
  /** Total service months entered. */
  totalServiceMonths: number;
  /** True when continuous service meets the 5-year gate (≥ 60 months). */
  qualifies: boolean;
}

export type GratuityFieldErrors = {
  salary?: string;
  years?: string;
  months?: string;
  service?: string;
  form?: string;
};

/** Example — ₹50,000 monthly wages · 10 years → ₹288,461.54. */
export const EXAMPLE_TEN_YEARS: GratuityInput = {
  salary: '50000',
  salaryCurrency: 'PKR',
  years: '10',
  months: '0',
  gratuityCurrency: 'PKR',
};

export function createDefaultInput(): GratuityInput {
  return {
    salary: '',
    salaryCurrency: 'PKR',
    years: '5',
    months: '0',
    gratuityCurrency: 'PKR',
  };
}
