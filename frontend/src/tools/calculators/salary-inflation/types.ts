import type { SupportedCurrency } from '@/tools/shared/currency';

export interface SalaryInflationInput {
  /** Salary in the reference period. */
  referenceSalary: string;
  referenceSalaryCurrency: SupportedCurrency;
  /** Single-period inflation rate (%). Never FX-converted. */
  inflationPercent: string;
  /** Display currency for inflation-adjusted salary. */
  adjustedSalaryCurrency: SupportedCurrency;
  /** Your current salary (independent currency; normalized for comparison). */
  currentSalary: string;
  currentSalaryCurrency: SupportedCurrency;
  /** Display currency for gain or loss. */
  gainLossCurrency: SupportedCurrency;
}

export interface SalaryInflationResult {
  /** Full-precision adjusted salary in reference currency. */
  adjustedSalaryCanonical: number;
  /** Full-precision gain/loss in reference currency (current − adjusted). */
  gainLossCanonical: number;
  /** Current salary normalized into reference currency. */
  currentSalaryCanonical: number;
  adjustedSalary: number;
  gainLoss: number;
  referenceSalaryCurrency: SupportedCurrency;
  adjustedSalaryCurrency: SupportedCurrency;
  currentSalaryCurrency: SupportedCurrency;
  gainLossCurrency: SupportedCurrency;
  formattedAdjustedSalary: string;
  formattedGainLoss: string;
}

export type SalaryInflationFieldErrors = {
  referenceSalary?: string;
  inflationPercent?: string;
  currentSalary?: string;
  form?: string;
};

/** Example 1 — Pay beat inflation (gain). */
export const EXAMPLE_BEAT_INFLATION: SalaryInflationInput = {
  referenceSalary: '100000',
  referenceSalaryCurrency: 'PKR',
  inflationPercent: '5',
  adjustedSalaryCurrency: 'PKR',
  currentSalary: '110000',
  currentSalaryCurrency: 'PKR',
  gainLossCurrency: 'PKR',
};

/** Example 2 — Purchasing-power loss. */
export const EXAMPLE_PURCHASING_POWER_LOSS: SalaryInflationInput = {
  referenceSalary: '100000',
  referenceSalaryCurrency: 'PKR',
  inflationPercent: '10',
  adjustedSalaryCurrency: 'PKR',
  currentSalary: '100000',
  currentSalaryCurrency: 'PKR',
  gainLossCurrency: 'PKR',
};

export function createDefaultInput(): SalaryInflationInput {
  return {
    referenceSalary: '',
    referenceSalaryCurrency: 'PKR',
    inflationPercent: '',
    adjustedSalaryCurrency: 'PKR',
    currentSalary: '',
    currentSalaryCurrency: 'PKR',
    gainLossCurrency: 'PKR',
  };
}
