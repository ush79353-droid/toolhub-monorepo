import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface SalaryInflationCalculationInput {
  /** Reference salary already in one currency. */
  referenceSalary: number;
  /** Single-period inflation rate (%). May be zero or negative (>-100). */
  inflationPercent: number;
  /** Current salary already normalized into the reference currency. */
  currentSalary: number;
}

export interface SalaryInflationCalculationResult {
  adjustedSalary: number;
  gainLoss: number;
}

/**
 * Single-period inflation adjustment and purchasing-power gain/loss.
 * Money inputs must already share one currency. Inflation % is never
 * FX-converted.
 *
 * Adjusted = Reference × (1 + i/100)
 * Gain/Loss = Current − Adjusted
 *
 * Rejects nonfinite inputs and inflation ≤ −100% (factor ≤ 0). Returns null
 * when the result is nonfinite.
 */
export function calculateSalaryInflation(
  input: SalaryInflationCalculationInput
): SalaryInflationCalculationResult | null {
  const { referenceSalary, inflationPercent, currentSalary } = input;

  if (
    ![referenceSalary, inflationPercent, currentSalary].every(Number.isFinite)
  ) {
    return null;
  }

  if (!(referenceSalary >= 0) || !(currentSalary >= 0)) return null;

  const inflationFactor = 1 + inflationPercent / 100;
  if (!(inflationFactor > 0)) return null;

  const adjustedSalary = referenceSalary * inflationFactor;
  if (!Number.isFinite(adjustedSalary)) return null;

  const gainLoss = currentSalary - adjustedSalary;
  if (!Number.isFinite(gainLoss)) return null;

  return { adjustedSalary, gainLoss };
}

/** Display rounding only — never used inside formulas. */
export function formatSalaryInflationMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
