import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DurationUnit, PayFrequency, RatePeriod } from './types';

/** Assumed workdays per week when converting hours ↔ days. */
export const WORKDAYS_PER_WEEK = 5;
/** Weeks per year for monthly conversion (52/12). */
export const WEEKS_PER_YEAR = 52;

export function formatFloridaOvertimeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Hours per week from a duration amount at a given frequency.
 * Example: 40 hours/week → 40; 8 hours/day → 8 × 5 = 40.
 */
export function toWeeklyHours(
  amount: number,
  durationUnit: DurationUnit,
  frequency: PayFrequency
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;

  let hoursPerFreq: number;
  switch (durationUnit) {
    case 'hours':
      hoursPerFreq = amount;
      break;
    case 'days':
      hoursPerFreq = amount * 8;
      break;
    case 'weeks':
      hoursPerFreq = amount * WORKDAYS_PER_WEEK * 8;
      break;
    case 'months':
      hoursPerFreq = amount * (WEEKS_PER_YEAR / 12) * WORKDAYS_PER_WEEK * 8;
      break;
    default:
      return null;
  }

  switch (frequency) {
    case 'week':
      return hoursPerFreq;
    case 'month':
      return hoursPerFreq / (WEEKS_PER_YEAR / 12);
    case 'year':
      return hoursPerFreq / WEEKS_PER_YEAR;
    default:
      return null;
  }
}

/** Convert a duration@frequency amount into hours per month. */
export function toMonthlyHours(
  amount: number,
  durationUnit: DurationUnit,
  frequency: PayFrequency
): number | null {
  const weekly = toWeeklyHours(amount, durationUnit, frequency);
  if (weekly === null) return null;
  return weekly * (WEEKS_PER_YEAR / 12);
}

/**
 * Normalize a pay rate into an hourly rate using the regular weekly schedule.
 * hoursPerDay = weeklyHours / WORKDAYS_PER_WEEK
 */
export function toHourlyRate(
  rate: number,
  period: RatePeriod,
  weeklyHours: number
): number | null {
  if (!Number.isFinite(rate) || rate < 0) return null;
  if (!(weeklyHours > 0) || !Number.isFinite(weeklyHours)) return null;
  const hoursPerDay = weeklyHours / WORKDAYS_PER_WEEK;
  const hoursPerMonth = weeklyHours * (WEEKS_PER_YEAR / 12);
  const hoursPerYear = weeklyHours * WEEKS_PER_YEAR;
  if (!(hoursPerDay > 0)) return null;

  switch (period) {
    case 'hour':
      return rate;
    case 'day':
      return rate / hoursPerDay;
    case 'week':
      return rate / weeklyHours;
    case 'month':
      return rate / hoursPerMonth;
    case 'year':
      return rate / hoursPerYear;
    default:
      return null;
  }
}

/** Express an hourly rate in another rate period using the weekly schedule. */
export function fromHourlyRate(
  hourly: number,
  period: RatePeriod,
  weeklyHours: number
): number | null {
  if (!Number.isFinite(hourly) || hourly < 0) return null;
  if (!(weeklyHours > 0) || !Number.isFinite(weeklyHours)) return null;
  const hoursPerDay = weeklyHours / WORKDAYS_PER_WEEK;
  const hoursPerMonth = weeklyHours * (WEEKS_PER_YEAR / 12);
  const hoursPerYear = weeklyHours * WEEKS_PER_YEAR;

  switch (period) {
    case 'hour':
      return hourly;
    case 'day':
      return hourly * hoursPerDay;
    case 'week':
      return hourly * weeklyHours;
    case 'month':
      return hourly * hoursPerMonth;
    case 'year':
      return hourly * hoursPerYear;
    default:
      return null;
  }
}

/** Scale a monthly money amount into week / month / year. */
export function fromMonthlyPay(
  monthly: number,
  frequency: PayFrequency
): number | null {
  if (!Number.isFinite(monthly)) return null;
  switch (frequency) {
    case 'week':
      return monthly / (WEEKS_PER_YEAR / 12);
    case 'month':
      return monthly;
    case 'year':
      return monthly * 12;
    default:
      return null;
  }
}

/**
 * Core Florida overtime math (money already in one currency; hours normalized).
 * Regular monthly = hourly × weeklyHours × 52/12
 * OT hourly = regular hourly × multiplier
 * OT monthly = OT hourly × monthly OT hours
 * Total = regular monthly + OT monthly
 */
export function calculateFloridaOvertime(input: {
  hourlyRegularRate: number;
  weeklyRegularHours: number;
  overtimeMultiplier: number;
  monthlyOvertimeHours: number;
}): {
  hourlyOvertimeRate: number;
  monthlyRegularPay: number;
  monthlyOvertimePay: number;
  monthlyTotalPay: number;
} | null {
  const {
    hourlyRegularRate,
    weeklyRegularHours,
    overtimeMultiplier,
    monthlyOvertimeHours,
  } = input;

  if (
    ![
      hourlyRegularRate,
      weeklyRegularHours,
      overtimeMultiplier,
      monthlyOvertimeHours,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (hourlyRegularRate < 0 || weeklyRegularHours < 0) return null;
  if (overtimeMultiplier < 0 || monthlyOvertimeHours < 0) return null;

  const hourlyOvertimeRate = hourlyRegularRate * overtimeMultiplier;
  const monthlyRegularPay =
    hourlyRegularRate * weeklyRegularHours * (WEEKS_PER_YEAR / 12);
  const monthlyOvertimePay = hourlyOvertimeRate * monthlyOvertimeHours;
  const monthlyTotalPay = monthlyRegularPay + monthlyOvertimePay;

  if (
    ![
      hourlyOvertimeRate,
      monthlyRegularPay,
      monthlyOvertimePay,
      monthlyTotalPay,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    hourlyOvertimeRate,
    monthlyRegularPay,
    monthlyOvertimePay,
    monthlyTotalPay,
  };
}
