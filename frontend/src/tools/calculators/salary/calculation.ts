import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const WEEKS_PER_YEAR = 52;

/**
 * Convert hourly pay into daily / weekly / monthly / annual equivalents.
 *
 * Formulas (52-week convention):
 *   Weekly hours          = Hours/day × Days/week
 *   Weekly pay            = Hourly × Weekly hours
 *   Annual scheduled days = Days/week × 52
 *   Annual                = Hourly × Hours/day × Annual scheduled days
 *   Monthly               = Annual ÷ 12
 *   Daily                 = Hourly × Hours/day
 *
 * Holidays and paid vacation are NOT deducted from annual paid salary.
 * Full precision; no display rounding inside formulas.
 */
export function calculateSalary(input: {
  hourlyPay: number;
  hoursPerDay: number;
  daysPerWeek: number;
}): {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hoursPerWeek: number;
  annualScheduledDays: number;
} | null {
  const { hourlyPay, hoursPerDay, daysPerWeek } = input;
  if (![hourlyPay, hoursPerDay, daysPerWeek].every(Number.isFinite)) {
    return null;
  }
  if (hourlyPay < 0) return null;
  if (!(hoursPerDay > 0)) return null;
  if (!(daysPerWeek > 0)) return null;

  const hoursPerWeek = hoursPerDay * daysPerWeek;
  const weekly = hourlyPay * hoursPerWeek;
  const annualScheduledDays = daysPerWeek * WEEKS_PER_YEAR;
  const annual = hourlyPay * hoursPerDay * annualScheduledDays;
  const monthly = annual / 12;
  const daily = hourlyPay * hoursPerDay;

  if (
    ![weekly, annual, monthly, daily, hoursPerWeek, annualScheduledDays].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if ([weekly, annual, monthly, daily].some((v) => v < 0)) return null;

  return {
    hourly: hourlyPay,
    daily,
    weekly,
    monthly,
    annual,
    hoursPerWeek,
    annualScheduledDays,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatSalaryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
