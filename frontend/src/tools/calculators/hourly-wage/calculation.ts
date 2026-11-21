import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Paid weeks per year (screenshot / salary-family assumption). */
export const WEEKS_PER_YEAR = 52;

/** Working days per week for daily wage = weekly ÷ 5. */
export const WORKING_DAYS_PER_WEEK = 5;

/**
 * Hourly wage → period amounts (prompt formulas):
 *   Per second  = H / 3600
 *   Per minute  = H / 60
 *   Daily       = H × W / 5
 *   Weekly      = H × W
 *   Biweekly    = H × W × 2
 *   Monthly     = H × W × 52 / 12
 *   Annual      = H × W × 52
 *
 * H ≥ 0; W > 0. Full precision; round only for display.
 */
export function calculateHourlyWage(input: {
  hourlyWage: number;
  hoursPerWeek: number;
}): {
  perSecond: number;
  perMinute: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
} | null {
  const { hourlyWage, hoursPerWeek } = input;
  if (![hourlyWage, hoursPerWeek].every(Number.isFinite)) return null;
  if (hourlyWage < 0) return null;
  if (!(hoursPerWeek > 0)) return null;

  const perSecond = hourlyWage / 3600;
  const perMinute = hourlyWage / 60;
  const weekly = hourlyWage * hoursPerWeek;
  const daily = weekly / WORKING_DAYS_PER_WEEK;
  const biweekly = weekly * 2;
  const annual = weekly * WEEKS_PER_YEAR;
  const monthly = annual / 12;

  if (
    ![perSecond, perMinute, daily, weekly, biweekly, monthly, annual].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (
    [perSecond, perMinute, daily, weekly, biweekly, monthly, annual].some(
      (v) => v < 0
    )
  ) {
    return null;
  }

  return {
    perSecond,
    perMinute,
    daily,
    weekly,
    biweekly,
    monthly,
    annual,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatHourlyWageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
