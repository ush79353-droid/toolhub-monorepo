import {
  DEFAULT_OVERTIME_MULTIPLIER,
  MAX_REGULAR_HOURS,
  MAX_SHIFT_HOURS,
  MAX_SHIFTS_PER_WEEK,
  MAX_WAGE,
  MAX_WEEKS_PER_YEAR,
  type TwelveHourShiftPayInput,
  type TwelveHourShiftPayResult,
} from './types';

/** Money is rounded to cents. Display currency only changes the symbol. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

export function suggestedOvertimeWage(hourlyWage: number): number {
  return roundMoney(hourlyWage * DEFAULT_OVERTIME_MULTIPLIER);
}

function hoursOk(value: number, max: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= max;
}

export function calculateTwelveHourShiftPay(
  input: TwelveHourShiftPayInput
): TwelveHourShiftPayResult | null {
  const {
    hourlyWage,
    overtimeHourlyWage,
    regularHours,
    shiftHours,
    shiftsPerWeek,
    weeksPerYear,
  } = input;

  if (!Number.isFinite(hourlyWage) || hourlyWage < 0 || hourlyWage > MAX_WAGE) return null;
  if (!Number.isFinite(overtimeHourlyWage) || overtimeHourlyWage < 0 || overtimeHourlyWage > MAX_WAGE) {
    return null;
  }
  if (!hoursOk(regularHours, MAX_REGULAR_HOURS)) return null;
  if (!Number.isFinite(shiftHours) || shiftHours <= 0 || shiftHours > MAX_SHIFT_HOURS) return null;
  if (regularHours > shiftHours) return null;
  if (!hoursOk(shiftsPerWeek, MAX_SHIFTS_PER_WEEK)) return null;
  if (!Number.isFinite(weeksPerYear) || weeksPerYear < 1 || weeksPerYear > MAX_WEEKS_PER_YEAR) return null;

  const overtimeHours = shiftHours - regularHours;
  const regularPay = roundMoney(regularHours * hourlyWage);
  const overtimePay = roundMoney(overtimeHours * overtimeHourlyWage);
  const shiftPay = roundMoney(regularPay + overtimePay);
  const averageHourlyPay = roundMoney(shiftPay / shiftHours);
  const weeklyPay = roundMoney(shiftPay * shiftsPerWeek);
  const yearlyPay = roundMoney(weeklyPay * weeksPerYear);
  const monthlyPay = roundMoney((weeklyPay * weeksPerYear) / 12);

  const result: TwelveHourShiftPayResult = {
    regularHours,
    overtimeHours,
    shiftHours,
    hourlyWage,
    overtimeHourlyWage,
    overtimeWageSource: input.overtimeWageSource,
    regularPay,
    overtimePay,
    shiftPay,
    averageHourlyPay,
    weeklyPay,
    monthlyPay,
    yearlyPay,
    shiftsPerWeek,
    weeksPerYear,
    currency: input.currency,
  };

  const amounts = [
    result.regularPay,
    result.overtimePay,
    result.shiftPay,
    result.averageHourlyPay,
    result.weeklyPay,
    result.monthlyPay,
    result.yearlyPay,
  ];
  if (amounts.some((amount) => !Number.isFinite(amount))) return null;
  return result;
}
