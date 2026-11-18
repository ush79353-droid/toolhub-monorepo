/**
 * Single-period salary inflation adjustment — UI scaffold.
 * Formulas land in the engine commit.
 */
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function calculateSalaryInflation(_input: {
  referenceSalary: number;
  inflationPercent: number;
  currentSalary: number;
}): { adjustedSalary: number; gainLoss: number } | null {
  return null;
}

/** Display rounding only — never used inside the formulas. */
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
