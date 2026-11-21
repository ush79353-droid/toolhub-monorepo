import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const WEEKS_PER_YEAR = 52;

/**
 * Convert hourly wage into weekly / annual / monthly / daily pay.
 *
 * Formulas:
 *   Weekly  = Hourly × Hours/week
 *   Annual  = Weekly × 52
 *   Monthly = Annual ÷ 12
 *   Per day = Weekly ÷ Days/week
 *
 * Full precision; no display rounding inside formulas.
 */
export function calculateHourlyToAnnual(input: {
  hourlyWage: number;
  hoursPerWeek: number;
  daysPerWeek: number;
}): {
  weekly: number;
  annual: number;
  monthly: number;
  daily: number;
  hourly: number;
} | null {
  const { hourlyWage, hoursPerWeek, daysPerWeek } = input;
  if (![hourlyWage, hoursPerWeek, daysPerWeek].every(Number.isFinite)) {
    return null;
  }
  if (hourlyWage < 0) return null;
  if (!(hoursPerWeek > 0)) return null;
  if (!(daysPerWeek > 0)) return null;

  const weekly = hourlyWage * hoursPerWeek;
  const annual = weekly * WEEKS_PER_YEAR;
  const monthly = annual / 12;
  const daily = weekly / daysPerWeek;

  if (![weekly, annual, monthly, daily].every(Number.isFinite)) return null;
  if ([weekly, annual, monthly, daily].some((v) => v < 0)) return null;

  return {
    weekly,
    annual,
    monthly,
    daily,
    hourly: hourlyWage,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatWageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
