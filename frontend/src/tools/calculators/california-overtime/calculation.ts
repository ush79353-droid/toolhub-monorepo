import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DurationPeriod, PayRateUnit } from './types';

export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
/** Standard weekday count used only to bridge day ↔ week when converting units. */
export const WORK_DAYS_PER_WEEK = 5;

/**
 * Convert a duration expressed as hours-per-period into hours per week.
 * Duration unit is always hours (screenshot); period is day/week/month/year.
 */
export function hoursPerWeekFromDuration(
  hours: number,
  period: DurationPeriod
): number | null {
  if (!Number.isFinite(hours) || hours < 0) return null;
  switch (period) {
    case 'day':
      return hours * WORK_DAYS_PER_WEEK;
    case 'week':
      return hours;
    case 'month':
      return (hours * MONTHS_PER_YEAR) / WEEKS_PER_YEAR;
    case 'year':
      return hours / WEEKS_PER_YEAR;
    default:
      return null;
  }
}

/** Convert hours-per-period into hours per calendar month (52/12 weeks). */
export function hoursPerMonthFromDuration(
  hours: number,
  period: DurationPeriod
): number | null {
  const weekly = hoursPerWeekFromDuration(hours, period);
  if (weekly === null || !Number.isFinite(weekly)) return null;
  return weekly * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
}

/**
 * Normalize a pay rate into an hourly rate using the regular weekly-hours schedule.
 * Day rates assume WORK_DAYS_PER_WEEK; month/year use 52/12 week-months.
 */
export function toHourlyRate(
  rate: number,
  unit: PayRateUnit,
  weeklyHours: number
): number | null {
  if (!Number.isFinite(rate) || rate < 0) return null;
  if (!Number.isFinite(weeklyHours) || !(weeklyHours > 0)) return null;

  switch (unit) {
    case 'hour':
      return rate;
    case 'day': {
      const hoursPerDay = weeklyHours / WORK_DAYS_PER_WEEK;
      return hoursPerDay > 0 ? rate / hoursPerDay : null;
    }
    case 'week':
      return rate / weeklyHours;
    case 'month': {
      const monthlyHours = weeklyHours * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
      return monthlyHours > 0 ? rate / monthlyHours : null;
    }
    case 'year': {
      const yearlyHours = weeklyHours * WEEKS_PER_YEAR;
      return yearlyHours > 0 ? rate / yearlyHours : null;
    }
    default:
      return null;
  }
}

/** Re-express an hourly rate in another pay-rate unit using the same schedule. */
export function fromHourlyRate(
  hourly: number,
  unit: PayRateUnit,
  weeklyHours: number
): number | null {
  if (!Number.isFinite(hourly) || !Number.isFinite(weeklyHours) || !(weeklyHours > 0)) {
    return null;
  }
  switch (unit) {
    case 'hour':
      return hourly;
    case 'day':
      return hourly * (weeklyHours / WORK_DAYS_PER_WEEK);
    case 'week':
      return hourly * weeklyHours;
    case 'month':
      return hourly * weeklyHours * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
    case 'year':
      return hourly * weeklyHours * WEEKS_PER_YEAR;
    default:
      return null;
  }
}

/**
 * Regular Monthly Pay = Hourly Rate × Weekly Hours × 52/12
 * Overtime Rate = Hourly Rate × Multiplier
 * Overtime Pay = Overtime Rate × Overtime Hours (per month)
 * Total Pay = Regular Pay + Overtime Pay
 *
 * Full IEEE precision; never NaN/Infinity. Not a California legal overtime engine —
 * daily OT, double time, and seventh-day rules are not modeled from these inputs.
 */
export function calculateCaliforniaOvertime(input: {
  regularPay: number;
  regularPayUnit: PayRateUnit;
  regularWorkHours: number;
  regularWorkPeriod: DurationPeriod;
  overtimeMultiplier: number;
  overtimeHours: number;
  overtimeHoursPeriod: DurationPeriod;
}): {
  hourlyRate: number;
  weeklyHours: number;
  monthlyRegularPay: number;
  overtimeHourlyRate: number;
  overtimeHoursPerMonth: number;
  monthlyOvertimePay: number;
  monthlyTotalPay: number;
} | null {
  const {
    regularPay,
    regularPayUnit,
    regularWorkHours,
    regularWorkPeriod,
    overtimeMultiplier,
    overtimeHours,
    overtimeHoursPeriod,
  } = input;

  if (
    ![regularPay, regularWorkHours, overtimeMultiplier, overtimeHours].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (regularPay < 0 || regularWorkHours < 0 || overtimeHours < 0) return null;
  if (!(overtimeMultiplier >= 0)) return null;

  const weeklyHours = hoursPerWeekFromDuration(regularWorkHours, regularWorkPeriod);
  if (weeklyHours === null || !(weeklyHours > 0)) return null;

  const hourlyRate = toHourlyRate(regularPay, regularPayUnit, weeklyHours);
  if (hourlyRate === null || !Number.isFinite(hourlyRate)) return null;

  const monthlyRegularPay =
    hourlyRate * weeklyHours * (WEEKS_PER_YEAR / MONTHS_PER_YEAR);
  if (!Number.isFinite(monthlyRegularPay)) return null;

  const overtimeHourlyRate = hourlyRate * overtimeMultiplier;
  if (!Number.isFinite(overtimeHourlyRate)) return null;

  const overtimeHoursPerMonth = hoursPerMonthFromDuration(
    overtimeHours,
    overtimeHoursPeriod
  );
  if (overtimeHoursPerMonth === null || !Number.isFinite(overtimeHoursPerMonth)) {
    return null;
  }

  const monthlyOvertimePay = overtimeHourlyRate * overtimeHoursPerMonth;
  if (!Number.isFinite(monthlyOvertimePay)) return null;

  const monthlyTotalPay = monthlyRegularPay + monthlyOvertimePay;
  if (!Number.isFinite(monthlyTotalPay)) return null;

  return {
    hourlyRate,
    weeklyHours,
    monthlyRegularPay,
    overtimeHourlyRate,
    overtimeHoursPerMonth,
    monthlyOvertimePay,
    monthlyTotalPay,
  };
}

export function formatCaliforniaOvertimeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
