import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { SalaryPayPeriod, Weekday } from './types';

/** Actual calendar days in month `month` (1–12). Handles leap February. */
export function daysInCalendarMonth(year: number, month: number): number | null {
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  if (month < 1 || month > 12) return null;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Number.isFinite(days) && days > 0 ? days : null;
}

/**
 * Count weekdays in the month that are not in `daysOff`.
 * Uses UTC civil calendar (no local timezone shift).
 */
export function countScheduledWorkingDays(
  year: number,
  month: number,
  daysOff: readonly Weekday[]
): number | null {
  const dim = daysInCalendarMonth(year, month);
  if (dim === null) return null;

  const off = new Set<number>(daysOff);
  let count = 0;
  for (let day = 1; day <= dim; day += 1) {
    const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    if (!off.has(dow)) count += 1;
  }
  return count;
}

/**
 * Normalize gross pay into a monthly amount for the proration formula.
 * - month: as-is
 * - year: ÷ 12
 * - week: × 52/12
 * - day: × scheduled working days in the month
 */
export function normalizeToMonthlySalary(
  gross: number,
  payPeriod: SalaryPayPeriod,
  scheduledWorkingDays: number
): number | null {
  if (!Number.isFinite(gross) || !(gross >= 0)) return null;
  if (!Number.isFinite(scheduledWorkingDays) || !(scheduledWorkingDays >= 0)) {
    return null;
  }

  switch (payPeriod) {
    case 'month':
      return gross;
    case 'year':
      return gross / 12;
    case 'week':
      return (gross * 52) / 12;
    case 'day':
      return gross * scheduledWorkingDays;
    default:
      return null;
  }
}

export interface ProratedSalaryCalculationInput {
  year: number;
  month: number;
  grossSalary: number;
  payPeriod: SalaryPayPeriod;
  daysWorked: number;
  holidays: number;
  approvedLeave: number;
  /** Distinct off-weekdays; length should equal 7 − workdaysPerWeek. */
  daysOff: readonly Weekday[];
}

export interface ProratedSalaryCalculationResult {
  calendarDaysInMonth: number;
  scheduledWorkingDays: number;
  payableDays: number;
  monthlySalary: number;
  proratedSalary: number;
}

/**
 * Payable days = days worked + holidays + approved leave (each once; all paid).
 * Prorated = MonthlySalary × PayableDays / ScheduledWorkingDays.
 * Returns null when schedule has zero working days or inputs are nonfinite.
 */
export function calculateProratedSalary(
  input: ProratedSalaryCalculationInput
): ProratedSalaryCalculationResult | null {
  const {
    year,
    month,
    grossSalary,
    payPeriod,
    daysWorked,
    holidays,
    approvedLeave,
    daysOff,
  } = input;

  if (
    ![
      year,
      month,
      grossSalary,
      daysWorked,
      holidays,
      approvedLeave,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  if (!(grossSalary >= 0)) return null;
  if (!(daysWorked >= 0) || !(holidays >= 0) || !(approvedLeave >= 0)) {
    return null;
  }

  const calendarDaysInMonth = daysInCalendarMonth(year, month);
  if (calendarDaysInMonth === null) return null;

  const scheduledWorkingDays = countScheduledWorkingDays(year, month, daysOff);
  if (scheduledWorkingDays === null) return null;
  if (!(scheduledWorkingDays > 0)) return null;

  const payableDays = daysWorked + holidays + approvedLeave;
  if (!Number.isFinite(payableDays) || !(payableDays >= 0)) return null;

  const monthlySalary = normalizeToMonthlySalary(
    grossSalary,
    payPeriod,
    scheduledWorkingDays
  );
  if (monthlySalary === null || !Number.isFinite(monthlySalary)) return null;

  const proratedSalary =
    (monthlySalary * payableDays) / scheduledWorkingDays;
  if (!Number.isFinite(proratedSalary)) return null;

  return {
    calendarDaysInMonth,
    scheduledWorkingDays,
    payableDays,
    monthlySalary,
    proratedSalary,
  };
}

/** Display rounding only — never used inside formulas. */
export function formatProratedSalaryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
