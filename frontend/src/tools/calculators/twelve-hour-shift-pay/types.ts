import type { SupportedCurrency } from '@/tools/shared/currency';

/** Suggested overtime wage is 1.5× regular pay until the user types their own rate. */
export type OvertimeWageSource = 'suggested' | 'entered';

export interface TwelveHourShiftPayInput {
  hourlyWage: number;
  overtimeHourlyWage: number;
  overtimeWageSource: OvertimeWageSource;
  /** Non-overtime hours inside one shift. */
  regularHours: number;
  shiftHours: number;
  shiftsPerWeek: number;
  weeksPerYear: number;
  currency: SupportedCurrency;
}

export interface TwelveHourShiftPayResult {
  regularHours: number;
  overtimeHours: number;
  shiftHours: number;
  hourlyWage: number;
  overtimeHourlyWage: number;
  overtimeWageSource: OvertimeWageSource;
  regularPay: number;
  overtimePay: number;
  shiftPay: number;
  averageHourlyPay: number;
  weeklyPay: number;
  monthlyPay: number;
  yearlyPay: number;
  shiftsPerWeek: number;
  weeksPerYear: number;
  currency: SupportedCurrency;
}

export type TwelveHourShiftPayField =
  | 'hourlyWage'
  | 'overtimeHourlyWage'
  | 'regularHours'
  | 'shiftHours'
  | 'shiftsPerWeek'
  | 'weeksPerYear';

export type TwelveHourShiftPayFieldErrors = Partial<Record<TwelveHourShiftPayField, string>>;

export const DEFAULT_OVERTIME_MULTIPLIER = 1.5;
export const DEFAULT_REGULAR_HOURS = 8;
export const DEFAULT_SHIFT_HOURS = 12;
export const DEFAULT_SHIFTS_PER_WEEK = 5;
export const DEFAULT_WEEKS_PER_YEAR = 52;
export const MAX_WAGE = 1_000_000;
export const MAX_SHIFT_HOURS = 24;
export const MAX_REGULAR_HOURS = 12;
export const MAX_SHIFTS_PER_WEEK = 14;
export const MAX_WEEKS_PER_YEAR = 53;

export const DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT: TwelveHourShiftPayInput = {
  hourlyWage: 20,
  overtimeHourlyWage: 30,
  overtimeWageSource: 'suggested',
  regularHours: DEFAULT_REGULAR_HOURS,
  shiftHours: DEFAULT_SHIFT_HOURS,
  shiftsPerWeek: DEFAULT_SHIFTS_PER_WEEK,
  weeksPerYear: DEFAULT_WEEKS_PER_YEAR,
  currency: 'PKR',
};
