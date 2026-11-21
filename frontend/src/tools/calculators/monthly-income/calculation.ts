import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MonthlyIncomeSourceField } from './types';

/**
 * Convert hourly/daily/weekly/yearly earnings and derive monthly income.
 * H hours/day, D days/week, W weeks/year (defaults 8 / 5 / 52).
 * Monthly = Yearly / 12. Full precision; display rounding only in formatters.
 */
export function calculateMonthlyIncome(input: {
  sourceField: MonthlyIncomeSourceField;
  sourceAmount: number;
  hoursPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
}): {
  hourly: number;
  daily: number;
  weekly: number;
  yearly: number;
  monthly: number;
} | null {
  const {
    sourceField,
    sourceAmount,
    hoursPerDay: H,
    daysPerWeek: D,
    weeksPerYear: W,
  } = input;
  if (![sourceAmount, H, D, W].every(Number.isFinite)) return null;
  if (sourceAmount < 0) return null;
  if (!(H > 0) || !(D > 0) || !(W > 0)) return null;

  let hourly: number;
  let daily: number;
  let weekly: number;
  let yearly: number;

  if (sourceField === 'hourly') {
    hourly = sourceAmount;
    daily = hourly * H;
    weekly = hourly * H * D;
    yearly = hourly * H * D * W;
  } else if (sourceField === 'daily') {
    daily = sourceAmount;
    hourly = daily / H;
    weekly = daily * D;
    yearly = daily * D * W;
  } else if (sourceField === 'weekly') {
    weekly = sourceAmount;
    hourly = weekly / (H * D);
    daily = weekly / D;
    yearly = weekly * W;
  } else {
    yearly = sourceAmount;
    hourly = yearly / (H * D * W);
    daily = yearly / (D * W);
    weekly = yearly / W;
  }

  const monthly = yearly / 12;
  if (![hourly, daily, weekly, yearly, monthly].every(Number.isFinite)) {
    return null;
  }
  if ([hourly, daily, weekly, yearly, monthly].some((v) => v < 0)) return null;
  return { hourly, daily, weekly, yearly, monthly };
}

export function formatMonthlyIncomeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
