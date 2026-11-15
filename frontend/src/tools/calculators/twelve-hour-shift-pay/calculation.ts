import {
  MAX_REGULAR_HOURS,
  MAX_WAGE,
  SHIFT_HOURS,
  WEEKS_PER_MONTH,
  WEEKS_PER_YEAR,
  WORKDAYS_PER_WEEK,
  type TwelveHourShiftPayInput,
  type TwelveHourShiftPayResult,
} from './types';

/** Money is rounded to cents once per displayed amount. Display currency only changes the symbol. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

function wageOk(value: number): boolean {
  return Number.isFinite(value) && value > 0 && value <= MAX_WAGE;
}

/**
 * Regular hours above 12 are rejected, not clamped.
 * Overtime hours are `max(12 − regular hours, 0)`.
 */
export function calculateTwelveHourShiftPay(
  input: TwelveHourShiftPayInput
): TwelveHourShiftPayResult | null {
  const { hourlyWage, overtimeHourlyWage, regularHours } = input;

  if (!wageOk(hourlyWage) || !wageOk(overtimeHourlyWage)) return null;
  if (!Number.isFinite(regularHours) || regularHours < 0 || regularHours > MAX_REGULAR_HOURS) return null;

  const overtimeHours = Math.max(SHIFT_HOURS - regularHours, 0);
  const payPerDay = roundMoney(regularHours * hourlyWage + overtimeHours * overtimeHourlyWage);
  const averageHourlyPay = roundMoney(payPerDay / SHIFT_HOURS);
  const payPerWeek = roundMoney(payPerDay * WORKDAYS_PER_WEEK);
  const payPerMonth = roundMoney(payPerWeek * WEEKS_PER_MONTH);
  const payPerYear = roundMoney(payPerWeek * WEEKS_PER_YEAR);

  const result: TwelveHourShiftPayResult = {
    regularHours,
    overtimeHours,
    hourlyWage,
    overtimeHourlyWage,
    averageHourlyPay,
    payPerDay,
    payPerWeek,
    payPerMonth,
    payPerYear,
    currency: input.currency,
  };

  const amounts = [averageHourlyPay, payPerDay, payPerWeek, payPerMonth, payPerYear];
  if (amounts.some((amount) => !Number.isFinite(amount))) return null;
  return result;
}
