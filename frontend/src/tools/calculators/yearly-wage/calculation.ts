import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * UI scaffold placeholder — real yearly-wage math lands in the engine commit.
 */
export function calculateYearlyWage(_input: {
  hourlyWage: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  taxPercent: number;
}): {
  yearlyWage: number;
  netHourly: number;
  netYearly: number;
} | null {
  return null;
}

/** Display rounding only — never used inside the formulas. */
export function formatYearlyWageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
